import keystone from 'keystone'

exports = module.exports = function(req, res) {
	const view = new keystone.View(req, res)
	const locals = res.locals
	locals.section = 'home'
	console.log(req.locale)
	view.render('index')
};
