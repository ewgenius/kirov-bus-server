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
    console.log(`http://m.cdsvyatka.com/many_json.php?marsh=${route}`);
    socket.join(`route-${route}`);
    request(`http://m.cdsvyatka.com/many_json.php?marsh=${route}`)
      .then(r => {
        console.log(typeof r, r);
        return r;
      })
      .then(r => JSON.parse(r))
      .then(result => {
        io.to(`route-${route}`).emit('route.update', {
          route: route,
          data: result
        });
      }).catch(err => console.error(err));
  });

  socket.on('unsubscribe', route => {
    socket.leave(`route-${route.id}`);
  });
});

server.listen(PORT, () => {
  let host = server.address().address;
  let port = server.address().port;
  console.log(`server listening at http://${host}:${port}, for ${origins}`);
})
