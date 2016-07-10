"use strict";
var dotenv_1 = require('dotenv');
var keystone = require('keystone');
var _ = require('underscore');
var routes = require('./routes');
dotenv_1.config();
keystone.init({
    'name': 'dtlbox',
    'brand': 'dtlbox',
    'static': '../public',
    'favicon': '../public/favicon.ico',
    'views': '../templates/views',
    'view engine': 'jade',
    'auto update': true,
    'session': true,
    'auth': true,
    'user model': 'User',
    'cookie secret': process.env.COOKIE_SECRET
});
keystone.import('models');
keystone.set('locals', {
    _: _,
    env: keystone.get('env'),
    utils: keystone.utils,
    editable: keystone.content.editable,
});
keystone.set('routes', routes);
keystone.set('nav', {});
keystone.start();
