'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _http = require('http');

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getOrigins() {
  if (process.env.ENVIRONMENT === 'prod') return 'https://kirov-bus.firebaseapp.com';else return 'http://localhost:8000';
}

var origins = getOrigins();

var PORT = process.env.PORT || 3000;
var app = (0, _express2.default)();
app.use((0, _cors2.default)({
  origin: origins,
  credentials: true
}));

app.get('/api/route', function (req, res) {
  return _routes2.default.getRoute(req.query.route).then(function (route) {
    return res.send(route);
  }).catch(function (err) {
    return res.status(500).send(err);
  });
});

app.get('/api/routes', function (req, res) {
  res.send([1, 2, 3, 4, 5]);
});

var server = (0, _http.createServer)(app);
var io = (0, _socket2.default)(server);

io.set('origins', origins + ':443');

io.on('connection', function (socket) {
  socket.emit('connected', 'test');

  socket.on('subscribe', function (route) {
    console.log('subscribed to ' + route);
    socket.join('route-' + route);
  });

  socket.on('unsubscribe', function (route) {
    console.log('unsubscribed from ' + route);
    socket.leave('route-' + route.id);
  });
});

var pool = [1001, 1002, 1003, 1005, 1009, 1010, 1012, 1014, 1015, 1016, 1017, 1019, 1020, 1021, 1022, 1023, 1026, 1033, 1037, 1038, 1039, 1044, 1046, 1050, 1051, 1052, 1053, 1054, 1061, 1067, 1070, 1074, 1084, 1087, 1088, 1090, 3101, 3104, 3116, 3117, 3129, 3136, 3143, 3146, 5001, 5003, 5004, 5005, 5007, 5008, 5011, 5014];

function requestRoute(route) {
  return (0, _requestPromise2.default)('http://m.cdsvyatka.com/many_json.php?marsh=' + route).then(function (r) {
    return JSON.parse(r.trim());
  });
}

setInterval(function () {
  if (pool.length > 0) {
    (function () {
      var route = pool.pop();
      requestRoute(route).then(function (result) {
        console.log('update for ' + route);
        io.to('route-' + route).emit('route.update', {
          route: route,
          data: result
        });
        pool.unshift(route);
      }).catch(function () {
        console.log('retry for ' + route);
        pool.push(route);
      });
    })();
  }
}, 50);

server.listen(PORT, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('server listening at http://' + host + ':' + port + ', for ' + origins);
});