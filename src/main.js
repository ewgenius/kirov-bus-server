import express from 'express';
import cors from 'cors';
import {
  createServer
} from 'http';
import IO from 'socket.io';

const origins = 'https://kirov-bus.firebaseapp.com';

let PORT = process.env.PORT || 3000;
let app = express();
app.use(cors({
  origin: origins,
  credentials: true
}));

const server = createServer(app);
const io = IO(server);

io.set('origins', origins);

io.on('connection', socket => {
  console.log('connected');
  socket.emit('connected', 'test');
});

server.listen(PORT, () => {
  let host = server.address().address;
  let port = server.address().port;

  console.log(`server listening at http://${host}:${port}`);
})
