'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _http = require('http');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PORT = process.env.PORT || 3000;

var app = (0, _express2.default)();
var server = (0, _http.createServer)(app);
var io = (0, _socket2.default)(server);

io.on('connection', function (socket) {
  socket.emit('connected');
});

server.listen(PORT, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('server listening at http://' + host + ':' + port);
});