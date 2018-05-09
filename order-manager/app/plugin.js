const plugin = function (options) {
  const seneca = this;

  /**
   * Fetch orders with optional /:id param.
   */
  seneca.add({role: 'order', cmd: 'fetch'}, function ({args = {}}, done) {
    const orders = seneca.make('orders');
    const id = args.params.id || args.body.id;
    if (id) {
      orders.load$({}, done);
    }
    else {
      orders.list$({id}, done);
    }
  });

  /**
   * Removes order by Id.
   */
  seneca.add({role: 'order', cmd: 'delete'}, function (args, done) {
    const orders = this.make('orders');
    orders.remove$({id: args.id}, function (err) {
      done(err, null);
    });
  });

  /**
   * Create order and save it to storage.
   */
  seneca.add({role: 'order', cmd: 'create'}, function ({args, products}, done) {
    const orders = this.make('orders');
    orders.total = products.reduce((total, product) => { total += product.price; return total; }, 0);
    orders.custEmail = args.body.email;
    orders.custName = args.body.name;
    orders.save$(done);
  });

  return 'order-manager';
};

module.exports = plugin;
