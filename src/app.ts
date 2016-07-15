import * as express from 'express'
import {createServer} from 'http'
import * as IO from 'socket.io'
import * as mongoose from 'mongoose'
import {CDS} from './api/api'

const PORT = process.env.PORT || 3000

const app = express()
const server = createServer(app)
const io = IO(server)

const cds = new CDS()
cds.on('routeUpdate', (route, update) => {
  console.log(route, update)
  io.to(String(route)).emit('route.update', update)
})

io.on('connection', socket => {
  socket.on('subscribe', route => {
    socket.join(route)
  })

  socket.on('unsubscribe', route => {
    socket.leave(route)
  })
})

server.listen(PORT, () => {
  console.log(`server is ready on ${server.address().port}`)
})
