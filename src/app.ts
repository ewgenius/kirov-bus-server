import {config} from 'dotenv'
import * as path from 'path'
import * as keystone from 'keystone'
import * as _ from 'underscore'
import * as routes from './routes'

config()

keystone.init({
  'name': 'dtlbox',
  'brand': 'dtlbox',
  'static': '../public',
  'favicon': '../public/favicon.ico',
  'views': '../templates/views',
  'view engine': 'jade',
  //'auto update': true,
  'session': true,
  'auth': true,
  'user model': 'User',
  'cookie secret': process.env.COOKIE_SECRET
})

keystone.import('models')

keystone.set('locals', {
  _: _,
  env: keystone.get('env'),
  utils: keystone.utils,
  editable: keystone.content.editable,
})

keystone.set('routes', routes)

keystone.set('nav', {
})

keystone.start()
