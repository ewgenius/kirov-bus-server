"use strict";
var dotenv_1 = require('dotenv');
var fs_1 = require('fs');
var path = require('path');
var express = require('express');
var cors = require('cors');
var http_1 = require('http');
var IO = require('socket.io');
var mongoose = require('mongoose');
var api_1 = require('./api/api');
var Promise = require('bluebird');
var ramda_1 = require('ramda');
dotenv_1.config();
var PORT = process.env.PORT || 3000;
var FRONTEND_HOST = process.env.FRONTEND_HOST || 'http://localhost:8080';
var MONGO_URL = process.env.MONGO_URL;
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
if (MONGO_URL)
    mongoose.connect(MONGO_URL, function (err) {
        if (err)
            console.log(err);
        else {
            importModels('models');
            var Stop = mongoose.model('Stop');
            var Route_1 = mongoose.model('Route');
            cds.getRoutes().then(function (routes) {
                ramda_1.keys(routes).map(function (route) {
                    cds.getRoute(route).then(function (result) {
                        Route_1.findOne({
                            route: route
                        })
                            .exec()
                            .then(function (routeModel) {
                            console.log(routeModel.id);
                            if (route[0] === '1')
                                routeModel.routeType = 'city_bus';
                            if (route[0] === '3')
                                routeModel.routeType = 'intercity_bus';
                            if (route[0] === '5')
                                routeModel.routeType = 'trolleybus';
                            routeModel.routeNumber = String(parseInt(route.substring(1), 10));
                            return routeModel.save();
                        });
                    });
                });
            });
        }
    });
app.use(cors({
    origin: FRONTEND_HOST,
    credentials: true
}));
app.get('/api/v1/proxy/routes', function (req, res) {
    cds.getRoutes()
        .then(function (result) { return res.send(result); })
        .catch(function (err) { return res.status(500).send(err); });
});
app.get('/api/v1/proxy/routes/:route', function (req, res) {
    cds.getRoute(req.params.route)
        .then(function (result) { return res.send(result); })
        .catch(function (err) { return res.status(500).send(err); });
});
app.get('/api/v1/routes', function (req, res) {
    mongoose.model('Route')
        .find()
        .limit(20)
        .exec()
        .then(function (result) {
        res.send(result);
    });
});
app.get('/api/v1/routes/byId/:id', function (req, res) {
    mongoose.model('Route')
        .findById(req.params.id)
        .exec()
        .then(function (result) {
        res.send(result);
    });
});
app.get('/api/v1/routes/byRoute/:route', function (req, res) {
    mongoose.model('Route')
        .findOne({
        route: req.params.route
    })
        .exec()
        .then(function (result) {
        res.send(result);
    });
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
app.get('/api/v1/stops/search', function (req, res) {
    var q = req.query.q || '';
    var lng = Number(req.query.lng);
    var lat = Number(req.query.lat);
    var distance = Number(req.query.d || 1);
    var query = {
        name: new RegExp('^' + q + '.*$', "i"),
    };
    if (lat && lng) {
        query['location'] = {
            $near: {
                $maxDistance: distance,
                $geometry: {
                    type: 'Point',
                    coordinates: [lng, lat]
                }
            }
        };
    }
    mongoose.model('Stop')
        .find(query)
        .limit(20)
        .exec()
        .then(function (result) {
        res.send(result);
    });
});
app.get('/api/v1/stops/byId/:id', function (req, res) {
    mongoose.model('Stop')
        .findById(req.params.id)
        .exec()
        .then(function (result) {
        res.send(result);
    });
});
app.get('/api/v1/stops/byCode/:code', function (req, res) {
    mongoose.model('Stop')
        .findOne({
        code: req.params.code
    })
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
