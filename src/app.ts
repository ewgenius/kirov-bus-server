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

const PORT = process.env.PORT || 3000
const FRONTEND_HOST = process.env.FRONTEND_HOST || 'http://localhost:8080'

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
mongoose.connect(`mongodb://admin:admin@ds017195.mlab.com:17195/kirov-bus`, err => {
  if (err) console.log(err)
  else {
    importModels('models')

    const Stop = mongoose.model('Stop')


    //import routes

    cds.getRoutes().then(routes => {
      keys(routes).map(route => {
        cds.getRoute(route).then(result => {
          //console.log(result.scheme)
        })
      })
    })


    /*
    import bus stops
*/
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

  }
})

// http server
app.use(cors({
  origin: FRONTEND_HOST,
  credentials: true
}))

app.get('/api/v1/routes', (req, res) => {
  cds.getRoutes()
    .then(result => res.send(result))
    .catch(err => res.status(500).send(err))
})

app.get('/api/v1/routes/:route', (req, res) => {
  cds.getRoute(req.params.route)
    .then(result => res.send(result))
    .catch(err => res.status(500).send(err))
})

app.get('/api/v1/stops', (req, res) => {
  mongoose.model('Stop')
    .find()
    .limit(20)
    .exec()
    .then(result => {
      res.send(result)
    })
})

app.get('/api/v1/stops/:id', (req, res) => {
  mongoose.model('Stop')
    .findById(req.params.id)
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
