import {model, Model, Document, Schema} from 'mongoose'
import {schemaStop} from './Stop'

export interface IRoute extends Document {
  route: string
}

export const schemaRoute = new Schema({
  route: {
    type: String
  }
})

console.log('init model')
const Route = model('Route', schemaRoute)
export default Route
