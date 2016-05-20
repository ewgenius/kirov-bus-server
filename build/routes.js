'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  getRoute: function getRoute(route) {
    return (0, _requestPromise2.default)('http://m.cdsvyatka.com/scheme.php?marsh=' + route).then(function (r) {
      return JSON.parse(r);
    });
  }
};