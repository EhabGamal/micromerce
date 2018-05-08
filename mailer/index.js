const seneca = require('seneca')();
const plugin = require('./app/plugin');

seneca
  .use(plugin)
  .ready(function(err){
    seneca.listen(9003);
  });
