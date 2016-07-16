"use strict";
var fs_1 = require('fs');
var path = require('path');
var express = require('express');
var cors = require('cors');
var http_1 = require('http');
var IO = require('socket.io');
var mongoose = require('mongoose');
var api_1 = require('./api/api');
var Promise = require('bluebird');
var PORT = process.env.PORT || 3000;
var FRONTEND_HOST = process.env.FRONTEND_HOST || 'http://localhost:8080';
var app = express();
var server = http_1.createServer(app);
var io = IO(server);
var cds = new api_1.CDS();
cds.on('routeUpdate', function (route, update) {
    console.log(route, update);
    io.to(String(route)).emit('route.update', update);
});
function importModels(base) {
    var modelsPath = path.join(__dirname, base);
    fs_1.readdirSync(modelsPath).forEach(function (file) {
        var model = require('./' + base + '/' + file);
    });
}
var p = 'Promise';
mongoose[p] = Promise;
mongoose.connect("mongodb://admin:admin@ds017195.mlab.com:17195/kirov-bus", function (err) {
    if (err)
        console.log(err);
    else {
        importModels('models');
        var Stop = mongoose.model('Stop');
    }
});
app.use(cors({
    origin: FRONTEND_HOST,
    credentials: true
}));
app.get('/api/v1/routes', function (req, res) {
    cds.getRoutes()
        .then(function (result) { return res.send(result); })
        .catch(function (err) { return res.status(500).send(err); });
});
app.get('/api/v1/routes/:route', function (req, res) {
    cds.getRoute(req.params.route)
        .then(function (result) { return res.send(result); })
        .catch(function (err) { return res.status(500).send(err); });
});
app.get('/api/v1/stops', function (req, res) {
    mongoose.model('Stop')
        .find()
        .limit(20)
        .exec()
        .then(function (result) {
        res.send(result);
    });
});
app.get('/api/v1/stops/:id', function (req, res) {
    mongoose.model('Stop')
        .findById(req.params.id)
        .exec()
        .then(function (result) {
        res.send(result);
    });
});
io.on('connection', function (socket) {
    socket.on('subscribe', function (route) {
        socket.join(route);
        cds.subscribe(route);
    });
    socket.on('unsubscribe', function (route) {
        socket.leave(route);
        cds.unsubscribe(route);
    });
});
server.listen(PORT, function () {
    console.log("server is ready on " + server.address().port);
});
