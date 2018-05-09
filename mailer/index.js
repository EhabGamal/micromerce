const seneca = require('seneca')();
const Plugin = require('./app/plugin');

seneca
  .use(Plugin)
  .ready((err) => {
    if (err) {
      seneca.log.err('Error starting mailer service!');
      return;
    }
    seneca.listen(9003);
  });
