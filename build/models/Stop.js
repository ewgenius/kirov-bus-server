"use strict";
var mongoose_1 = require('mongoose');
exports.schemaStop = new mongoose_1.Schema({
    name: {
        type: String
    }
});
console.log('init stop');
var Stop = mongoose_1.model('Stop', exports.schemaStop);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Stop;
