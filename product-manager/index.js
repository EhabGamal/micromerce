const seneca = require('seneca')();
const context = require('express')();
const adapter = require('seneca-web-adapter-express');

const plugin = require('./app/plugin');
const routes = require('./app/routes');

seneca
  .use('entity')
  .use('mongo-store', {uri: 'mongodb://127.0.0.1:27017/micromerce'})
  .use('web', { routes, context, adapter })
  .use(plugin)
  .ready(function(err){
    const app = seneca.export('web/context')();
    app.listen(3001);
    seneca.listen(9001);
  });
