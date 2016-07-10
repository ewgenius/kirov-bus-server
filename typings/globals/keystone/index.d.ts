declare module "keystone" {
  import {Schema} from 'mongoose'

  interface Utils {

  }

  interface Content {
    editable: (user: any, options: any) => any
  }

  class keystone {
    static init(options: any)
    static import(path: string)
    static set(key: string, value: any)
    static get(key: string): any
    static start(configuration?: any)
    static importer(path: string)
    static pre(event: string, handler: (req, res, next) => any)

    static utils: Utils
    static content: Content
  }

  namespace keystone {
    export function Keystone()
    export function View()

    export class List {
      schema: Schema
      defaultColumns: string

      constructor(name: string)

      add(options: any, permissions: any, permissionPArams: any)
      relationship(options: any)
      register()
    }

    module Field {
      module Types {
        export class AzureFile {}
        export class Boolean {}
        export class CloudinaryImage {}
        export class CloudinaryImages {}
        export class Code {}
        export class Color {}
        export class Date {}
        export class DateArray {}
        export class Datetime {}
        export class Email {}
        export class Embedly {}
        export class GeoPoint {}
        export class Html {}
        export class Key {}
        export class LocalFile {}
        export class LocalFiles {}
        export class Location {}
        export class Markdown {}
        export class Money {}
        export class Name {}
        export class Number {}
        export class NumberArray {}
        export class Password {}
        export class Relationship {}
        export class S3File {}
        export class Select {}
        export class Text {}
        export class TextArray {}
        export class Textarea {}
        export class Url {}
      }
    }
  }

  export = keystone
}
