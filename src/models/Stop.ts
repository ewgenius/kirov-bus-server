import {model, Model, Document, Schema} from 'mongoose'

export interface IStop extends Document {
  name: string
}

export const schemaStop = new Schema({
  name: {
    type: String
  }
})

console.log('init stop')
const Stop = model('Stop', schemaStop)
export default Stop
