import {model, Model, Document, Schema} from 'mongoose'
import {schemaStop} from './Stop'

export interface IRoute extends Document {
  route: string
  routeType: string
  routeNumber: string
  path: Array<{
    location: Array<number>
  }>
  stops: Array<any>
}

const schemaPoint = new Schema({
  location: {
    type: [Number],
    required: true
  }
})

export const schemaRoute = new Schema({
  route: {
    type: String,
    unique: true,
    dropDups: true,
    required: true
  },
  routeType: {
    type: String,
    enum: ['trolleybus', 'city_bus', 'intercity_bus', 'bus', 'shuttle']
  },
  routeNumber: {
    type: String
  },
  path: [schemaPoint],
  stops: [{
    type: Schema.Types.ObjectId,
    ref: 'Stop'
  }]
})

const Route = model('Route', schemaRoute)
export default Route
