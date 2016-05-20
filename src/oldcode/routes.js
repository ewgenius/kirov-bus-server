import request from 'request-promise';

export default {
  getRoute: route => {
    return request(`http://m.cdsvyatka.com/scheme.php?marsh=${route}`)
      .then(r => JSON.parse(r))
  }
};
