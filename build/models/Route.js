"use strict";
var mongoose_1 = require('mongoose');
exports.schemaRoute = new mongoose_1.Schema({
    route: {
        type: String
    }
});
console.log('init model');
var Route = mongoose_1.model('Route', exports.schemaRoute);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Route;
