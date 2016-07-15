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
var CDS = (function () {
    function CDS(interval) {
        var _this = this;
        if (interval === void 0) { interval = 1000; }
        this.routes = {
            route1001: null,
            route1002: null,
            route1003: null,
            route1005: null,
            route1009: null,
            route1010: null,
            route1012: null,
            route1014: null,
            route1015: null,
            route1016: null,
            route1017: null,
            route1019: null,
            route1020: null,
            route1021: null,
            route1022: null,
            route1023: null,
            route1026: null,
            route1033: null,
            route1037: null,
            route1038: null,
            route1039: null,
            route1044: null,
            route1046: null,
            route1050: null,
            route1051: null,
            route1052: null,
            route1053: null,
            route1054: null,
            route1061: null,
            route1067: null,
            route1070: null,
            route1074: null,
            route1084: null,
            route1087: null,
            route1088: null,
            route1090: null,
            route3101: null,
            route3104: null,
            route3116: null,
            route3117: null,
            route3129: null,
            route3136: null,
            route3143: null,
            route3146: null,
            route5001: null,
            route5003: null,
            route5004: null,
            route5005: null,
            route5007: null,
            route5008: null,
            route5011: null,
            route5014: null
        };
        this.onRouteUpdate = function () { };
        ramda_1.keys(this.routes).map(function (key) {
            _this.routes[key] = {
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
            var routeNumber = Number(key.substring(5));
            if (route.listenersCount > 0) {
                console.log("update route " + route);
                exports.requestRoute(routeNumber).then(function (result) {
                    if (!route.buses || JSON.stringify(route.buses) !== JSON.stringify(result)) {
                        _this.routes[key].buses = result;
                        _this.onRouteUpdate(routeNumber, result);
                    }
                });
            }
        });
    };
    CDS.prototype.loadRoute = function (route) {
        var _this = this;
        return exports.requestScheme(route).then(function (result) {
            _this.routes[("route" + route)].scheme = result.scheme;
            _this.routes[("route" + route)].busstop = result.busstop;
            _this.routes[("route" + route)].loaded = true;
            return _this.routes[("route" + route)];
        });
    };
    CDS.prototype.subscribe = function (route) {
        this.routes[("route" + route)].listenersCount += 1;
        if (!this.routes[("route" + route)].loaded) {
            this.loadRoute(route);
        }
    };
    CDS.prototype.unsubscribe = function (route) {
        if (this.routes[("route" + route)].listenersCount > 0)
            this.routes[("route" + route)].listenersCount -= 1;
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
