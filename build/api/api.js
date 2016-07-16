"use strict";
var request = require('request-promise');
var ramda_1 = require('ramda');
var HOST_CDS = "http://m.cdsvyatka.com";
var call = function (endpoint) {
    return request({
        uri: "" + HOST_CDS + endpoint,
        headers: {
            Referer: 'http://m.cdsvyatka.com/mobile_map.php'
        }
    })
        .then(function (result) { return JSON.parse(result.trim()); });
};
exports.requestRoute = function (route) {
    return call("/many_json.php?marsh=" + route)
        .then(function (result) {
        return ramda_1.keys(result).reduce(function (res, key) {
            var bus = result[key];
            res[key] = {
                info: bus.info,
                angle: bus.angle,
                route: Number(bus.marsh),
                lat: Number(bus.lat),
                lng: Number(bus.lng),
                number: Number(bus.marshnum)
            };
            return res;
        }, {});
    });
};
exports.requestScheme = function (route) {
    return call("/scheme.php?marsh=" + route)
        .then(function (result) {
        return {
            scheme: result.scheme.map(function (point) { return ({
                num: point.num,
                lat: Number(point.lat),
                lng: Number(point.lng)
            }); }),
            busstop: result.busstop.map(function (stop) { return ({
                code: stop.kod,
                name: stop.stop_name,
                lat: Number(stop.lat),
                lng: Number(stop.lng),
                link: stop.link
            }); })
        };
    });
};
var RouteType;
(function (RouteType) {
    RouteType[RouteType["bus"] = 1] = "bus";
    RouteType[RouteType["intercity"] = 2] = "intercity";
    RouteType[RouteType["troll"] = 3] = "troll";
})(RouteType || (RouteType = {}));
var CDS = (function () {
    function CDS(interval) {
        var _this = this;
        if (interval === void 0) { interval = 1000; }
        this.routes = {
            '1001': null,
            '1002': null,
            '1003': null,
            '1005': null,
            '1009': null,
            '1010': null,
            '1012': null,
            '1014': null,
            '1015': null,
            '1016': null,
            '1017': null,
            '1019': null,
            '1020': null,
            '1021': null,
            '1022': null,
            '1023': null,
            '1026': null,
            '1033': null,
            '1037': null,
            '1038': null,
            '1039': null,
            '1044': null,
            '1046': null,
            '1050': null,
            '1051': null,
            '1052': null,
            '1053': null,
            '1054': null,
            '1061': null,
            '1067': null,
            '1070': null,
            '1074': null,
            '1084': null,
            '1087': null,
            '1088': null,
            '1090': null,
            '3101': null,
            '3104': null,
            '3116': null,
            '3117': null,
            '3129': null,
            '3136': null,
            '3143': null,
            '3146': null,
            '5001': null,
            '5003': null,
            '5004': null,
            '5005': null,
            '5007': null,
            '5008': null,
            '5011': null,
            '5014': null
        };
        this.onRouteUpdate = function () { };
        ramda_1.keys(this.routes).map(function (key) {
            _this.routes[key] = {
                route: key,
                type: Number(key[0]),
                listenersCount: 0,
                scheme: null,
                busstop: null,
                buses: null,
                loaded: false
            };
        });
        setInterval(function () {
            _this.update();
        }, interval);
    }
    CDS.prototype.update = function () {
        var _this = this;
        ramda_1.keys(this.routes).map(function (key) {
            var route = _this.routes[key];
            if (route.listenersCount > 0) {
                console.log("update route " + route);
                exports.requestRoute(key).then(function (result) {
                    if (!route.buses || JSON.stringify(route.buses) !== JSON.stringify(result)) {
                        _this.routes[key].buses = result;
                        _this.onRouteUpdate(key, result);
                    }
                });
            }
        });
    };
    CDS.prototype.loadRoute = function (route) {
        var _this = this;
        return exports.requestScheme(route).then(function (result) {
            _this.routes[route].scheme = result.scheme;
            _this.routes[route].busstop = result.busstop;
            _this.routes[route].loaded = true;
            return _this.routes[route];
        });
    };
    CDS.prototype.getRoutes = function () {
        return Promise.resolve(this.routes);
    };
    CDS.prototype.getRoute = function (route) {
        var _this = this;
        return Promise.resolve().then(function () {
            if (!_this.routes[route].loaded)
                return _this.loadRoute(route);
            else
                return _this.routes[route];
        });
    };
    CDS.prototype.subscribe = function (route) {
        this.routes[route].listenersCount += 1;
        if (!this.routes[route].loaded) {
            this.loadRoute(route);
        }
    };
    CDS.prototype.unsubscribe = function (route) {
        if (this.routes[route].listenersCount > 0)
            this.routes[route].listenersCount -= 1;
    };
    CDS.prototype.on = function (event, cb) {
        switch (event) {
            case 'routeUpdate': {
                this.onRouteUpdate = cb;
                break;
            }
        }
    };
    return CDS;
}());
exports.CDS = CDS;
