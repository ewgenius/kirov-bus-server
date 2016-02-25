import express from 'express';
import cors from 'cors';
import request from 'request-promise';
import {
  createServer
} from 'http';
import IO from 'socket.io';
import routes from './routes';

function getOrigins() {
  if (process.env.ENVIRONMENT === 'prod')
    return 'https://kirov-bus.firebaseapp.com';
  else
    return `http://localhost:8000`;
}

const origins = getOrigins();

let PORT = process.env.PORT || 3000;
let app = express();
app.use(cors({
  origin: origins,
  credentials: true
}));

app.get('/api/route', (req, res) =>
  routes.getRoute(req.query.route)
  .then(route => res.send(route))
  .catch(err => res.status(500).send(err))
);

app.get('/api/routes', (req, res) => {
  res.send([1, 2, 3, 4, 5]);
});

const server = createServer(app);
const io = IO(server);

io.set('origins', origins + ':443');

io.on('connection', socket => {
  socket.emit('connected', 'test');

  socket.on('subscribe', route => {
    console.log(`subscribed to ${route}`);
    socket.join(`route-${route}`);
  });

  socket.on('unsubscribe', route => {
    console.log(`unsubscribed from ${route}`);
    socket.leave(`route-${route.id}`);
  });
});

const pool = [
  1001,
  1002,
  1003,
  1005,
  1009,
  1010,
  1012,
  1014,
  1015,
  1016,
  1017,
  1019,
  1020,
  1021,
  1022,
  1023,
  1026,
  1033,
  1037,
  1038,
  1039,
  1044,
  1046,
  1050,
  1051,
  1052,
  1053,
  1054,
  1061,
  1067,
  1070,
  1074,
  1084,
  1087,
  1088,
  1090,
  3101,
  3104,
  3116,
  3117,
  3129,
  3136,
  3143,
  3146,
  5001,
  5003,
  5004,
  5005,
  5007,
  5008,
  5011,
  5014
];

function requestRoute(route) {
  return request(`http://m.cdsvyatka.com/many_json.php?marsh=${route}`)
    .then(r => JSON.parse(r.trim()));
}

setInterval(() => {
  let route = pool.pop();
  requestRoute(route)
    .then(result => {
      console.log(`update for ${route}`);
      io.to(`route-${route}`).emit('route.update', {
        route: route,
        data: result
      });
      pool.unshift(route);
    })
    .catch(() => {
      console.log(`retry for ${route}`);
      pool.push(route);
    })
}, 50);

server.listen(PORT, () => {
  let host = server.address().address;
  let port = server.address().port;
  console.log(`server listening at http://${host}:${port}, for ${origins}`);
})
