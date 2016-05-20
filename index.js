/*
"babel": "^6.5.2",
"babel-core": "^6.5.2",
"babel-preset-es2015": "^6.5.0",
"babel-preset-node": "^5.1.1",
"bluebird": "^3.3.1",
"cors": "^2.7.1",
"express": "^4.13.4",
"request": "^2.69.0",
"request-promise": "^2.0.1",
"socket.io": "^1.4.5"
*/

require('dotenv').load();
var env = process.env.ENV || 'development';
if (env === 'development') {
  console.log('run in development mode');
  require('babel-core/register');
  require('./src/index.js');
}
if (env === 'production') {
  console.log('run in production mode');
  require('./build/index.js');
}
