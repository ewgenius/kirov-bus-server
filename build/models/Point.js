"use strict";
var mongoose_1 = require('mongoose');
exports.schemaPoint = new mongoose_1.Schema({
    geometry: {
        coordinates: {
            type: [Number],
            index: '2dsphere'
        }
    }
});
