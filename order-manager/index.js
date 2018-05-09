const seneca = require('seneca')();
const Plugin = require('./app/plugin');

seneca
  .use('entity')
  .use('mongo-store', {uri: 'mongodb://127.0.0.1:27017/micromerce'})
  .use(Plugin)
  .ready((err) => {
    if (err) {
      seneca.log.err('Error starting order-manager service!');
      return;
    }
    seneca.listen(9002);
  });
