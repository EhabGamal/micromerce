const Seneca = require('seneca');

const Plugin = require('./app/plugin');
const Options = require('../utils/options');

const seneca = Seneca(Options);

seneca
  .use(Plugin)
  .ready((err) => {
    if (err) {
      seneca.log.err('Error starting mailer service!');
      return;
    }
    seneca.listen(9003);
  });
