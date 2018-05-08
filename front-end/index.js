const express = require('express');
const seneca = require('seneca')();
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
  .use('web', webConfig)
  .use(plugin)
  .ready(function(err){
    const app = seneca.export('web/context')();
    app.listen(3000);
  });
