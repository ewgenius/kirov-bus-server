import {model, Model, Document, Schema} from 'mongoose'

export interface IStop extends Document {
  code: number
  name: string
  location: Array<Number>
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
  location: {
    type: [Number],
    index: '2dsphere'
  },
  link: {
    type: String
  }
})

const Stop = model('Stop', schemaStop)
export default Stop
