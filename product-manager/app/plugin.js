const plugin = function(options) {
  const seneca = this;

  /**
   * Fetch the list of all the products.
   */
  seneca.add({ role: "product", cmd: "fetch" }, function({ args }, done) {
    const id = args.params.id;
    const { category } = args.query;

    if(id) {
      seneca.act({ role: 'product', cmd: 'fetch', criteria: 'byId', id}, done);
    } else if(category) {
      seneca.act({ role: 'product', cmd: 'fetch', criteria: 'byCategory', category}, done);
    } else {
      const products = this.make("products");
      products.list$({}, done);
    }
  });

  /**
   * Fetch the list of products by category.
   */
  seneca.add({ role: "product", cmd: "fetch", criteria: "byCategory" }, function(args, done) {
      const products = this.make("products");
      products.list$({ category: args.category }, done);
    }
  );

  /**
   * Fetch a product by id.
   */
  seneca.add({ role: "product", cmd: "fetch", criteria: "byId" }, function(args, done) {
    var product = this.make("products");
    product.load$(args.id, done);
  });

  /**
   * Adds a product.
   */
  seneca.add({ role: "product", cmd: "add" }, function({ args }, done) {
    const body = JSON.parse(args.body);
    const products = this.make("products");
    products.name = body.name;
    products.description = body.description;
    products.category = body.category;
    products.price = body.price;
    products.save$(function(err, product) {
      done(err, products.data$(false));
    });
  });

  /**
   * Removes a product by id.
   */
  seneca.add({ role: "product", cmd: "remove" }, function({ args }, done) {
    const { id } = args.params;
    const product = this.make("products");
    product.remove$(id, function(err) {
      if(err) {
        done(err, null);
      } else {
        done(null, { delete: true });
      }
    });
  });

  /**
   * Edits a product fetching it by id first.
   */
  seneca.add({ role: "product", cmd: "edit" }, function({ args }, done) {
    seneca.act({ role: "product", cmd: "fetch", criteria: "byId", id: args.params.id },
      function(err, product) {
        const {
          name,
          category,
          description,
          price
        } = JSON.parse(args.body);
        product.data$({
          name: name || product.name,
          category: category || product.category,
          description: description || product.description,
          price: price || product.price
        });
        product.save$(function(err, product) {
          done(err, product.data$(false));
        });
      }
    );
  });
};

module.exports = plugin;
