const seneca = require('seneca')();
const plugin = require('./app/plugin');

seneca
  .use('entity')
  .use('mongo-store', {uri: 'mongodb://127.0.0.1:27017/micromerce'})
  .use(plugin)
  .ready(function(err){
    seneca.listen(9002);
  });
