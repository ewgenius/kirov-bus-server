"use strict";
var mongoose_1 = require('mongoose');
var Point_1 = require('./Point');
exports.schemaStop = new mongoose_1.Schema({
    code: {
        type: Number,
        unique: true,
        dropDups: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    position: {
        type: Point_1.schemaPoint,
        required: true
    },
    link: {
        type: String
    }
});
var Stop = mongoose_1.model('Stop', exports.schemaStop);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Stop;
