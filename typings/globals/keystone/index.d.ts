declare module "keystone" {
  interface Utils {

  }

  interface Content {
    editable: (user: any, options: any) => any
  }

  class keystone {
    static init(options: any)
    static import()
    static set(key: string, value: any)
    static get(key: string): any
    static start()

    static utils: Utils
    static content: Content
  }

  namespace keystone {
    export function Keystone()
    export function List()
    export function View()
  }

  export = keystone
}
