import {readdirSync} from 'fs'
import * as path from 'path'
import * as express from 'express'
import * as cors from 'cors'
import {createServer} from 'http'
import * as IO from 'socket.io'
import * as mongoose from 'mongoose'
import {CDS} from './api/api'

const PORT = process.env.PORT || 3000
const FRONTEND_HOST = process.env.FRONTEND_HOST || 'http://localhost:8080'

const app = express()
const server = createServer(app)
const io = IO(server)

// mongoose

function importModels(base) {
  const modelsPath = path.join(__dirname, base)
  readdirSync(modelsPath).forEach(file => {
    const model = require('./' + base + '/' + file)
  })
}

mongoose.connect(`mongodb://admin:admin@ds017195.mlab.com:17195/kirov-bus`, err => {
  if (err) console.log(err)
  else importModels('models')
})

// cds api
const cds = new CDS()
cds.on('routeUpdate', (route, update) => {
  console.log(route, update)
  io.to(String(route)).emit('route.update', update)
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
