const seneca = require('seneca')();
const express = require('express');
const adapter = require('seneca-web-adapter-express');

const plugin = require('./app/plugin');
const routes = require('./app/routes');

const context = express();
context.use(express.json());

const webConfig = {
  routes,
  context,
  adapter,
  options: {
    parseBody: false
  }
};

seneca
  .use('entity')
  .use('mongo-store', {uri: 'mongodb://127.0.0.1:27017/micromerce'})
  .use('web', webConfig)
  .use(plugin)
  .ready(function(err){
    const app = seneca.export('web/context')();
    app.listen(3001);
    seneca.listen(9001);
  });
