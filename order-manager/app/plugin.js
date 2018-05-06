const plugin = function(options) {
  const seneca = this;
  let mailer = null;

  seneca.add({role: 'order', cmd: 'fetch'}, function(args, donoe){
    const orders = this.make('orders');
    orders.list$({id: args.id}, done);
  });

  seneca.add({role: 'order', cmd: 'delete'}, function(args, done){
    const orders = this.make('orders');
    orders.remove$({id: args.id}, function(err){
      done(err, null);
    });
  });

  seneca.add({role: 'order', cmd: 'create'}, function(args, done){
    const { products } = args;
    let total = 0.0;
    products.forEach(product => {
      total += product.price;
    });
    const orders = this.make('orders');
    orders.total = total;
    orders.cust_email = args.email;
    orders.cust_name = args.name;
    orders.save$(function(err, order){
      const pattern = {
        role: 'email',
        cmd: 'send',
        to: `${args.name} <${args.email}>`,
        subject: 'Micromerce | New Order',
        html: '<h1>New ORder Created!</h1>'
      };
      mailer.act(pattern, done);
    });
  });

  seneca.add({init: 'order-manager'}, function(options, done){
    mailer = require('seneca')();
    mailer.client({
      host: '127.0.0.1',
      port: '3000'
    });
    done();
  });

  return 'order-manager';
}

module.exports = plugin;
