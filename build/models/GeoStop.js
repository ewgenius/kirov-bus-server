"use strict";
const mongoose_1 = require("mongoose");
exports.schemaGeoStop = new mongoose_1.Schema({
    type: {
        type: String,
        required: true
    },
    properties: {
        name: {
            type: String,
            required: true
        },
    },
    location: {
        type: [Number],
        index: '2dsphere'
    },
    link: {
        type: String
    },
    routes: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Route'
        }]
});
const GeoStop = mongoose_1.model('GeoStop', exports.schemaGeoStop);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GeoStop;
