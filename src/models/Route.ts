import {Model, Document, Schema} from 'mongoose'


/*mongoose.connect(`mongodb://admin:admin@ds017195.mlab.com:17195/kirov-bus`, err => {
  if (err) console.log(err)
  else {

  }
})*/

export interface IRoute extends Document {
  route: number,
  name: string
}

const schema = new Schema({
  id: {
    type: String,
    require: true
  },
  route: {
    name: Number,
    require: true
  }
})

export class Route {
  document: IRoute

  constructor(document: IRoute) {
    this.document = document
  }
}
