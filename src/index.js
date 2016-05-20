import express from 'express'
import IO from 'socket.io'
import {
  createServer
} from 'http'

const PORT = process.env.PORT || 3000

const app = express()
const server = createServer(app)
const io = IO(server)

io.on('connection', socket => {
  socket.emit('connected')
})

server.listen(PORT, () => {
  const host = server.address().address
  const port = server.address().port
  console.log(`server listening at http://${host}:${port}`)
})
