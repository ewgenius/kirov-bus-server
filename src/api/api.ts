import * as request from 'request-promise'
import {keys} from 'ramda'

const HOST_CDS = `http://m.cdsvyatka.com`

const call = (endpoint) => {
  return request({
    uri: `${HOST_CDS}${endpoint}`,
    headers: {
      Referer: 'http://m.cdsvyatka.com/mobile_map.php'
    }
  })
    .then(result => JSON.parse(result.trim()))
}

export interface Point {
  lat: number
  lng: number
}

export interface SchemePoint extends Point {
  num: number
}

export interface BusStop extends Point {
  code: string,
  name: string,
  link: string
}

export interface Bus extends Point {
  info: string,
  angle: number,
  route: string,
  number: number
}

export interface RouteResponse {
  [routeId: string]: Bus
}

export const requestRoute: (string) => Promise<any> = route => {
  return call(`/many_json.php?marsh=${route}`)
    .then(result => {
      return keys(result).reduce((res, key) => {
        const bus = result[key]
        res[key] = {
          info: bus.info,
          angle: bus.angle,
          route: Number(bus.marsh),
          lat: Number(bus.lat),
          lng: Number(bus.lng),
          number: Number(bus.marshnum)
        }
        return res
      }, {})
    })
}

interface SchemeResponse {
  scheme: Array<SchemePoint>,
  busstop: Array<BusStop>
}

export const requestScheme: (string) => Promise<SchemeResponse> = route => {
  return call(`/scheme.php?marsh=${route}`)
    .then(result => {
      return {
        scheme: result.scheme.map(point => ({
          num: point.num,
          lat: Number(point.lat),
          lng: Number(point.lng)
        })),
        busstop: result.busstop.map(stop => ({
          code: stop.kod,
          name: stop.stop_name,
          lat: Number(stop.lat),
          lng: Number(stop.lng),
          link: stop.link
        }))
      }
    })
}

enum RouteType {
  bus = 1,
  intercity,
  troll
}

interface RouteInstance extends SchemeResponse {
  route: string,
  type: RouteType,
  listenersCount: number,
  buses: RouteResponse,
  loaded: boolean
}

interface RoutesStorage {
  [route: string]: RouteInstance
}

export class CDS {
  private routes: RoutesStorage = {
    '1001': null,
    '1002': null,
    '1003': null,
    '1005': null,
    '1009': null,
    '1010': null,
    '1011': null,
    '1012': null,
    '1014': null,
    '1015': null,
    '1016': null,
    '1017': null,
    '1019': null,
    '1020': null,
    '1021': null,
    '1022': null,
    '1023': null,
    '1026': null,
    '1033': null,
    '1037': null,
    '1038': null,
    '1039': null,
    '1044': null,
    '1046': null,
    '1050': null,
    '1051': null,
    '1052': null,
    '1053': null,
    '1054': null,
    '1061': null,
    '1067': null,
    '1070': null,
    '1074': null,
    '1084': null,
    '1087': null,
    '1088': null,
    '1090': null,
    '3101': null,
    '3104': null,
    '3116': null,
    '3117': null,
    '3129': null,
    '3136': null,
    '3143': null,
    '3146': null,
    '5001': null,
    '5003': null,
    '5004': null,
    '5005': null,
    '5007': null,
    '5008': null,
    '5014': null
  }

  private onRouteUpdate: (route: string, update: any) => any = () => { }

  constructor(interval = 1000) {
    keys(this.routes).map(key => {
      this.routes[key] = {
        route: key,
        type: Number(key[0]),
        listenersCount: 0,
        scheme: null,
        busstop: null,
        buses: null,
        loaded: false
      }
    })

    setInterval(() => {
      this.update()
    }, interval)
  }

  private update() {
    keys(this.routes).map(key => {
      const route = this.routes[key]

      if (route.listenersCount > 0) {
        console.log(`update route ${route}`)

        requestRoute(key).then(result => {
          if (!route.buses || JSON.stringify(route.buses) !== JSON.stringify(result)) {
            this.routes[key].buses = result
            this.onRouteUpdate(key, result)
          }
        })
      }
    })
  }

  private loadRoute(route) {
    return requestScheme(route).then(result => {
      this.routes[route].scheme = result.scheme
      this.routes[route].busstop = result.busstop
      this.routes[route].loaded = true
      return this.routes[route]
    })
  }

  getRoutes() {
    return Promise.resolve(this.routes)
  }

  getRoute(route: string) {
    return Promise.resolve().then(() => {
      if (!this.routes[route].loaded)
        return this.loadRoute(route)
      else return this.routes[route]
    })
  }

  public subscribe(route: string) {
    this.routes[route].listenersCount += 1
    if (!this.routes[route].loaded) {
      this.loadRoute(route)
    }
  }

  public unsubscribe(route: string) {
    if (this.routes[route].listenersCount > 0)
      this.routes[route].listenersCount -= 1
  }

  public on(event: string, cb: (route: string, update: any) => any) {
    switch (event) {
      case 'routeUpdate': {
        this.onRouteUpdate = cb
        break
      }
    }
  }
}
