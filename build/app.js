"use strict";
var express = require('express');
var http_1 = require('http');
var IO = require('socket.io');
var api_1 = require('./api/api');
var PORT = process.env.PORT || 3000;
var app = express();
var server = http_1.createServer(app);
var io = IO(server);
var cds = new api_1.CDS();
cds.on('routeUpdate', function (route, update) {
    console.log(route, update);
    io.to(String(route)).emit('route.update', update);
});
io.on('connection', function (socket) {
    socket.on('subscribe', function (route) {
        socket.join(route);
    });
    socket.on('unsubscribe', function (route) {
        socket.leave(route);
    });
});
server.listen(PORT, function () {
    console.log("server is ready on " + server.address().port);
});
