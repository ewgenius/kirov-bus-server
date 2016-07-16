import {model, Model, Document, Schema} from 'mongoose'

export interface IPoint extends Document {
  geometry: {
    coordinates: Array<Number>
  }
}

export const schemaPoint = new Schema({
  geometry: {
    coordinates: {
      type: [Number],
      index: '2dsphere'
    }
  }
})
