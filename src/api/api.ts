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
  route: number,
  number: number
}

export interface RouteResponse {
  [routeId: string]: Bus
}

export const requestRoute: (number) => Promise<RouteResponse> = route => {
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

export const requestScheme: (number) => Promise<SchemeResponse> = route => {
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

interface RouteInstance extends SchemeResponse {
  listenersCount: number,
  buses: RouteResponse,
  loaded: boolean
}

interface RoutesStorage {
  [route: string]: RouteInstance
}

export class CDS {
  private routes: RoutesStorage = {
    route1001: null,
    route1002: null,
    route1003: null,
    route1005: null,
    route1009: null,
    route1010: null,
    route1012: null,
    route1014: null,
    route1015: null,
    route1016: null,
    route1017: null,
    route1019: null,
    route1020: null,
    route1021: null,
    route1022: null,
    route1023: null,
    route1026: null,
    route1033: null,
    route1037: null,
    route1038: null,
    route1039: null,
    route1044: null,
    route1046: null,
    route1050: null,
    route1051: null,
    route1052: null,
    route1053: null,
    route1054: null,
    route1061: null,
    route1067: null,
    route1070: null,
    route1074: null,
    route1084: null,
    route1087: null,
    route1088: null,
    route1090: null,
    route3101: null,
    route3104: null,
    route3116: null,
    route3117: null,
    route3129: null,
    route3136: null,
    route3143: null,
    route3146: null,
    route5001: null,
    route5003: null,
    route5004: null,
    route5005: null,
    route5007: null,
    route5008: null,
    route5011: null,
    route5014: null
  }

  private onRouteUpdate: (route: number, update: any) => any = () => {}

  constructor(interval = 1000) {
    keys(this.routes).map(key => {
      this.routes[key] = {
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
      const routeNumber = Number(key.substring(5))

      if (route.listenersCount > 0) {
        console.log(`update route ${route}`)

        requestRoute(routeNumber).then(result => {
          if (!route.buses || JSON.stringify(route.buses) !== JSON.stringify(result)) {
            this.routes[key].buses = result
            this.onRouteUpdate(routeNumber, result)
          }
        })
      }
    })
  }

  private loadRoute(route) {
    return requestScheme(route).then(result => {
      this.routes[`route${route}`].scheme = result.scheme
      this.routes[`route${route}`].busstop = result.busstop
      this.routes[`route${route}`].loaded = true
      return this.routes[`route${route}`]
    })
  }

  public subscribe(route: number) {
    this.routes[`route${route}`].listenersCount += 1
    if (!this.routes[`route${route}`].loaded) {
      this.loadRoute(route)
    }
  }

  public unsubscribe(route: number) {
    if (this.routes[`route${route}`].listenersCount > 0)
      this.routes[`route${route}`].listenersCount -= 1
  }

  public on(event: string, cb: (route: number, update: any) => any) {
    switch(event) {
      case 'routeUpdate': {
        this.onRouteUpdate = cb
        break
      }
    }
  }
}
