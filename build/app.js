"use strict";
var keystone = require('keystone');
var dotenv_1 = require('dotenv');
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
keystone.set('locals', {
    env: keystone.get('env'),
    utils: keystone.utils,
    editable: keystone.content.editable,
});
keystone.start();
