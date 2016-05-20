import request from 'request-promise'

export function getRoute(route) {
  return request(`http://m.cdsvyatka.com/many_json.php?marsh=${route}`)
    .then(r => JSON.parse(r.trim()));
}
