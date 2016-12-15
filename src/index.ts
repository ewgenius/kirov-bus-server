import * as path from 'path'
import { readdirSync, createWriteStream, existsSync, unlinkSync } from 'fs'
import * as mongoose from 'mongoose'
import { IRoute } from './models/Route'
(mongoose as any).Promise = Promise

function importModels(base) {
  const modelsPath = path.join(__dirname, base)
  readdirSync(modelsPath).forEach(file => {
    const model = require('./' + base + '/' + file)
  })
}

function serializeRoute(route: IRoute) {
  const routePath = path.join(__dirname, '../', 'data', `${route.routeNumber}.json`)
  const fileStream = createWriteStream(routePath)
  return new Promise(resolve => {
    if (existsSync(routePath))
      unlinkSync(routePath)
    fileStream.once('open', () => {
      console.log(`start ${route.routeNumber}`)
      fileStream.write(`{
  "type": "Feature",
  "properties": {
    "name": "${route.routeNumber}",
    "type": "${route.routeType}"
  },
  "geometry": {
    "type": "LineString",
    "coordinates": [`)

      route.path.map((point, i) => {
        fileStream.write(`
        [${point.location[0]}, ${point.location[1]}]`)
        if (i < route.path.length - 1)
          fileStream.write(',')
      })

      fileStream.write(`
    ]
  }
}`)
      fileStream.end()
      console.log(`done ${route.routeNumber}`)
      resolve()
    })
  })
}

async function main() {
  await mongoose.connect('mongodb://admin:admin@ds017195.mlab.com:17195/kirov-bus')

  importModels('models')

  const Stop = mongoose.model('Stop')
  const Route = mongoose.model('Route')

  const stops = await Stop.find({})
  const routes = await Route.find({})

  routes.map((route: IRoute, i) => {
    serializeRoute(route as IRoute)
  })

}

main()
