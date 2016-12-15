"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const path = require("path");
const fs_1 = require("fs");
const mongoose = require("mongoose");
mongoose.Promise = Promise;
function importModels(base) {
    const modelsPath = path.join(__dirname, base);
    fs_1.readdirSync(modelsPath).forEach(file => {
        const model = require('./' + base + '/' + file);
    });
}
function serializeRoute(route) {
    const routePath = path.join(__dirname, '../', 'data', `${route.routeNumber}.json`);
    const fileStream = fs_1.createWriteStream(routePath);
    return new Promise(resolve => {
        if (fs_1.existsSync(routePath))
            fs_1.unlinkSync(routePath);
        fileStream.once('open', () => {
            console.log(`start ${route.routeNumber}`);
            fileStream.write(`{
  "type": "Feature",
  "properties": {
    "name": "${route.routeNumber}",
    "type": "${route.routeType}"
  },
  "geometry": {
    "type": "LineString",
    "coordinates": [`);
            route.path.map((point, i) => {
                fileStream.write(`
        [${point.location[0]}, ${point.location[1]}]`);
                if (i < route.path.length - 1)
                    fileStream.write(',');
            });
            fileStream.write(`
    ]
  }
}`);
            fileStream.end();
            console.log(`done ${route.routeNumber}`);
            resolve();
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose.connect('mongodb://admin:admin@ds017195.mlab.com:17195/kirov-bus');
        importModels('models');
        const Stop = mongoose.model('Stop');
        const Route = mongoose.model('Route');
        const stops = yield Stop.find({});
        const routes = yield Route.find({});
        routes.map((route, i) => {
            serializeRoute(route);
        });
    });
}
main();
