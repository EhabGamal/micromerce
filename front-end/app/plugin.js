const plugin = function (options) {
  const seneca = this;
  let senecaMailer = null;
  let senecaProductManager = null;
  let senecaOrderProcessor = null;

  /**
   * Fetch products with optional /:id param.
  */
  seneca.add({ role: 'api', cmd: 'products' }, function ({args = {}}, done) {
    senecaProductManager.act({ role: 'product', cmd: 'fetch', args }, done);
  });

  /**
   * Fetch orders with optional /:id param.
   */
  seneca.add({ role: 'api', cmd: 'order', action: 'fetch' }, function ({args = {}}, done) {
    senecaOrderProcessor.act({ role: 'order', cmd: 'fetch', args }, done);
  });

  /**
   * Create order with specified product then sends confirmation email.
   */
  seneca.add({ role: 'api', cmd: 'order', action: 'create' }, function ({args = {}}, done) {
    senecaProductManager.act({ role: 'product', cmd: 'fetch', args }, function (err, product) {
      if (err) return done(err, null);
      const products = [seneca.util.clean(product)];
      senecaOrderProcessor.act({ role: 'order', cmd: 'create', args, products }, function (err, order) {
        if (err) return done(err, null);
        const {name, email} = args.body;
        order = seneca.util.clean(order);
        senecaMailer.act({
          role: 'email',
          cmd: 'send',
          to: `${name} <${email}>`,
          subject: 'Micromerce | New Order',
          body: `<h1>New Order Created!</h1><p>Order Details: <br/>${JSON.stringify(order)}</p>`
        }, function (err, result) {
          if (err) done(null, {status: 'Faild to send Email.'});
          else done(null, {status: 'Sent email successfully!'});
        });
      });
    });
  });

  /**
   * Init API plugin and connect to all needed services.
   */
  seneca.add({ init: 'api' }, function (options, done) {
    senecaProductManager = require('seneca')().client(9001).use('entity');
    senecaOrderProcessor = require('seneca')().client(9002).use('entity');
    senecaMailer = require('seneca')().client(9003);
    done();
  });

  return 'api';
};

module.exports = plugin;
