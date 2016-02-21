import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import request from 'request-promise';
import {
  createServer
} from 'http';
import IO from 'socket.io';

function getOrigins() {
  /*console.log(process.env.ENVIRONMENT);
  if (process.env.ENVIRONMENT === 'dev')
  else */
  //return `http://localhost:8000`;
  /*return `
    https://kirov-bus.firebaseapp.com:*,
    http://localhost:*,
    http://localhost:8000
    `;*/
  return 'https://kirov-bus.firebaseapp.com:9200';
}

const origins = getOrigins();

let PORT = process.env.PORT || 3000;
let app = express();
app.use(cors({
  origin: origins,
  credentials: true
}));

app.get('/api/route', (req, res) => {
  request(`http://m.cdsvyatka.com/scheme.php?marsh=${req.query.route}`)
    .then(r => JSON.parse(r))
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

app.get('/api/routes', (req, res) => {
  res.send([1, 2, 3, 4, 5]);
});

const server = createServer(app);
const io = IO(server);

io.set('origins', origins);

io.on('connection', socket => {
  console.log('connected');
  socket.emit('connected', 'test');

  socket.on('subscribe', route => {
    socket.join(`route-${route.id}`);
  });

  socket.on('unsubscribe', route => {
    socket.leave(`route-${route.id}`);
  });
});

server.listen(PORT, () => {
  let host = server.address().address;
  let port = server.address().port;
  console.log(`server listening at http://${host}:${port}`);
})
