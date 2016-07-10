"use strict";
var keystone = require('keystone');
var middleware_1 = require('./middleware');
keystone.pre('routes', middleware_1.initLocals);
keystone.pre('render', middleware_1.flashMessages);
var importRoutes = keystone.importer(__dirname);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = function (app) {
    app.get('/', function (req, res) {
        res.send('test');
    });
};
