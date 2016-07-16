import {model, Model, Document, Schema} from 'mongoose'
import {schemaStop} from './Stop'
import {schemaPoint, IPoint} from './Point'

export interface IRoute extends Document {
  route: string
  scheme: Array<IPoint>
}

export const schemaRoute = new Schema({
  route: {
    type: String
  },
  scheme: [schemaPoint]
})

console.log('init model')
const Route = model('Route', schemaRoute)
export default Route
