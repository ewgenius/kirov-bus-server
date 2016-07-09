import keystone from 'keystone'
import middleware from './middleware'
import i18n from 'i18n'
const importRoutes = keystone.importer(__dirname)

keystone.pre('routes', i18n.init)
keystone.pre('routes', middleware.initLocals)
keystone.pre('render', middleware.flashMessages)

const routes = {
	views: importRoutes('./views'),
}

exports = module.exports = function(app) {
	//app.get('/', routes.views.index)
	app.get('/', routes.views.index)
	app.get('/blog/:category?', routes.views.blog)
	app.get('/blog/post/:post', routes.views.post)
	app.all('/contact', routes.views.contact)
}
