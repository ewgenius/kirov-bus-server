import * as _ from 'underscore'

export const initLocals = (req, res, next) => {
  res.locals.navLinks = [
    { label: 'Home', key: 'home', href: '/' },
    { label: 'Blog', key: 'blog', href: '/blog' },
    { label: 'Contact', key: 'contact', href: '/contact' },
  ]
  res.locals.user = req.user
  next()
}

export const flashMessages = (req, res, next) => {
  var flashMessages = {
    info: req.flash('info'),
    success: req.flash('success'),
    warning: req.flash('warning'),
    error: req.flash('error'),
  }
  res.locals.messages = _.any(flashMessages, function(msgs) {
    return msgs.length
  }) ? flashMessages : false
  next()
}

export const requireUser = (req, res, next) => {
  if (!req.user) {
    req.flash('error', 'Please sign in to access this page.')
    res.redirect('/keystone/signin')
  } else {
    next()
  }
}
