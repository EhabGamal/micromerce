const Express = require('express');
const Seneca = require('seneca');
const Adapter = require('seneca-web-adapter-express');

const Plugin = require('./app/plugin');
const Routes = require('./app/routes');
const Options = require('../utils/options');

const seneca = Seneca(Options);
const context = Express();
context.use(Express.json());

const webConfig = {
  context,
  routes: Routes,
  adapter: Adapter,
  options: {
    parseBody: false
  }
};

seneca
  .use('web', webConfig)
  .use(Plugin)
  .ready((err) => {
    if (err) {
      seneca.log.err('Error starting front-end service!');
      return;
    }
    const app = seneca.export('web/context')();
    app.listen(3000);
  });
