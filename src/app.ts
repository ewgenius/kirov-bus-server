import {config} from 'dotenv'
import {readdirSync} from 'fs'
import * as path from 'path'
import * as express from 'express'
import * as cors from 'cors'
import {createServer} from 'http'
import * as IO from 'socket.io'
import * as mongoose from 'mongoose'
import {CDS} from './api/api'
import * as Promise from 'bluebird'
import {keys} from 'ramda'

import {IRoute} from './models/Route'
import {IStop} from './models/Stop'

config()

const PORT = process.env.PORT || 3000
const FRONTEND_HOST = process.env.FRONTEND_HOST || 'http://localhost:8080'
const MONGO_URL = process.env.MONGO_URL

const app = express()
const server = createServer(app)
const io = IO(server)

// cds api
const cds = new CDS()
cds.on('routeUpdate', (route, update) => {
  console.log(route, update)
  io.to(String(route)).emit('route.update', update)
})

// mongoose
function importModels(base) {
  const modelsPath = path.join(__dirname, base)
  readdirSync(modelsPath).forEach(file => {
    const model = require('./' + base + '/' + file)
  })
}

const p = 'Promise'
mongoose[p] = Promise
if (MONGO_URL)
  mongoose.connect(MONGO_URL, err => {
    if (err) console.log(err)
    else {
      importModels('models')

      const Stop = mongoose.model('Stop')
      const Route = mongoose.model('Route')

      /*
      //import routes

      cds.getRoutes().then(routes => {
        keys(routes).map((route, i) => {
          cds.getRoute(route).then(result => {
            console.log(route)
            Route.create({
              route,
              path: result.scheme.map(point => ({
                location: [
                  Number(point.lng),
                  Number(point.lat)
                ]
              }))
            })
          })
        })
      })
      */

      /*
      //import bus stops

      cds.getRoutes().then(routes => {
        keys(routes).map(route => {
          cds.getRoute(route).then(result => {
            result.busstop.map(stop => {
              console.log(stop.code)

              Stop.create({
                code: stop.code,
                name: stop.name,
                location: [stop.lng, stop.lat],
                link: stop.link
              }, err => {

              })
            })
          })
        })
      })
      */

      /*
      // update data

      cds.getRoutes().then(routes => {
        keys(routes).map(route => {
          cds.getRoute(route).then(result => {
            Route.findOne({
              route: route
            })
              .exec()
              .then((routeModel: IRoute) => {
                if (route[0] === '1')
                  routeModel.routeType = 'city_bus'
                if (route[0] === '3')
                  routeModel.routeType = 'intercity_bus'
                if (route[0] === '5')
                  routeModel.routeType = 'trolleybus'
                routeModel.routeNumber = String(parseInt(route.substring(1), 10))

                return Promise.all(result.busstop.map(stop => {
                  return Stop.findOne({
                    code: stop.code
                  })
                    .exec()
                    .then((stopModel: IStop) => {
                      if (!stopModel.routes)
                        stopModel.routes = []
                      if (stopModel.routes.indexOf(routeModel.id) === -1)
                        stopModel.routes.push(routeModel.id)

                      return stopModel.save()
                    })
                    .then((stopModel: IStop) => stopModel.id)
                }))
                  .then(ids => {
                    routeModel.stops = ids
                    console.log(routeModel.id)
                    return routeModel.save()
                  })
              })
          })
        })
      })

      */
    }
  })

// http server
app.use(cors({
  origin: FRONTEND_HOST,
  credentials: true
}))

app.get('/api/v1/proxy/routes', (req, res) => {
  cds.getRoutes()
    .then(result => res.send(result))
    .catch(err => res.status(500).send(err))
})

app.get('/api/v1/proxy/routes/:route', (req, res) => {
  cds.getRoute(req.params.route)
    .then(result => res.send(result))
    .catch(err => res.status(500).send(err))
})

//

app.get('/api/v1/routes', (req, res) => {
  mongoose.model('Route')
    .find()
    .populate('stops')
    .limit(20)
    .exec()
    .then(result => {
      res.send(result)
    })
})

app.get('/api/v1/routes/byId/:id', (req, res) => {
  mongoose.model('Route')
    .findById(req.params.id)
    .populate('stops')
    .exec()
    .then(result => {
      res.send(result)
    })
})

app.get('/api/v1/routes/byRoute/:route', (req, res) => {
  mongoose.model('Route')
    .findOne({
      route: req.params.route
    })
    .populate('stops')
    .exec()
    .then(result => {
      res.send(result)
    })
})

//

app.get('/api/v1/stops', (req, res) => {
  mongoose.model('Stop')
    .find()
    .populate('routes')
    .limit(20)
    .exec()
    .then(result => {
      res.send(result)
    })
})

app.get('/api/v1/stops/search', (req, res) => {
  const q = req.query.q || ''
  const lng = Number(req.query.lng)
  const lat = Number(req.query.lat)
  const distance = Number(req.query.d || 1)

  const query = {
    name: new RegExp('^' + q + '.*$', "i"),
  }

  if (lat && lng) {
    query['location'] = {
      $near: {
        $maxDistance: distance,
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        }
      }
    }
  }

  mongoose.model('Stop')
    .find(query)
    .populate('routes')
    .limit(20)
    .exec()
    .then(result => {
      res.send(result)
    })
})

app.get('/api/v1/stops/byId/:id', (req, res) => {
  mongoose.model('Stop')
    .findById(req.params.id)
    .populate('routes')
    .exec()
    .then(result => {
      res.send(result)
    })
})

app.get('/api/v1/stops/byCode/:code', (req, res) => {
  mongoose.model('Stop')
    .findOne({
      code: req.params.code
    })
    .populate('routes')
    .exec()
    .then(result => {
      res.send(result)
    })
})

// socket connection
io.on('connection', socket => {
  socket.on('subscribe', route => {
    socket.join(route)
    cds.subscribe(route)
  })

  socket.on('unsubscribe', route => {
    socket.leave(route)
    cds.unsubscribe(route)
  })
})

server.listen(PORT, () => {
  console.log(`server is ready on ${server.address().port}`)
})
