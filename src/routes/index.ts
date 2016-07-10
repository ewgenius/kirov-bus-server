import * as keystone from 'keystone'
import {initLocals, flashMessages, requireUser} from './middleware'

keystone.pre('routes', initLocals)
keystone.pre('render', flashMessages)

const importRoutes = keystone.importer(__dirname)

export default app => {
  app.get('/', (req, res) => {
    res.send('test')
  })
}
