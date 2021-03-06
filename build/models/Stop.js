"use strict";
const mongoose_1 = require("mongoose");
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
const Stop = mongoose_1.model('Stop', exports.schemaStop);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Stop;
