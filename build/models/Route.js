"use strict";
var mongoose_1 = require('mongoose');
var schema = new mongoose_1.Schema({
    id: {
        type: String,
        require: true
    },
    route: {
        name: Number,
        require: true
    }
});
var Route = (function () {
    function Route(document) {
        this.document = document;
    }
    return Route;
}());
exports.Route = Route;
