import {model, Model, Document, Schema} from 'mongoose'
import {schemaPoint, IPoint} from './Point'

export interface IStop extends Document {
  code: number
  name: string
  position: IPoint
  link?: string
}

export const schemaStop = new Schema({
  code: {
    type: Number,
    unique: true,
    dropDups: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  position: {
    type: schemaPoint,
    required: true
  },
  link: {
    type: String
  }
})

const Stop = model('Stop', schemaStop)
export default Stop
