import { model, Model, Document, Schema } from 'mongoose'
import { Feature, Point } from 'geojson'

export interface IGeoStop extends Document, Feature<Point> {
  properties: {
    name: string,
    routes: string[]
  }
}

export const schemaGeoStop = new Schema({
  type: {
    type: String,
    required: true
  },
  properties: {
    name: {
      type: String,
      required: true
    },
  },
  location: {
    type: [Number],
    index: '2dsphere'
  },
  link: {
    type: String
  },
  routes: [{
    type: Schema.Types.ObjectId,
    ref: 'Route'
  }]
})

const GeoStop = model('GeoStop', schemaGeoStop)
export default GeoStop