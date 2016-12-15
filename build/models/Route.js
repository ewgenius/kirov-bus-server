"use strict";
const mongoose_1 = require("mongoose");
const schemaPoint = new mongoose_1.Schema({
    location: {
        type: [Number],
        required: true
    }
});
exports.schemaRoute = new mongoose_1.Schema({
    route: {
        type: String,
        unique: true,
        dropDups: true,
        required: true
    },
    routeType: {
        type: String,
        enum: ['bus', 'shuttle', 'trolleybus']
    },
    routeNumber: {
        type: String
    },
    path: [schemaPoint],
    stops: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Stop'
        }]
});
const Route = mongoose_1.model('Route', exports.schemaRoute);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Route;
