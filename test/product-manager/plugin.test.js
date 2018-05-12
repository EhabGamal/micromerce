const Seneca = require('seneca');
const Chai = require('chai');
const Plugin = require('../../product-manager/app/plugin');

const expect = Chai.expect;

describe('Product Manager Service', () => {
  describe('Add Product Action', () => {
    let seneca = null;
    let Products = null;
    let body = {};

    before((done) => {
      seneca = Seneca().test(done).use('entity').use('mem-store').use(Plugin);
      Products = seneca.make('products');
      body = {
        name: 'Test Product',
        category: 'Category',
        description: 'Description',
        price: 12.75
      };
      done();
    });

    after((done) => {
      Products.remove$(body.id, (err) => {
        expect(err).to.be.null;
        done();
      });
    });

    it('should add product to store successfully', (done) => {
      seneca.act({ role: 'product', cmd: 'add', args: {body} }, (err, product) => {
        expect(err).to.be.null;
        body.id = product.id;
        expect(product).to.deep.equal(body);
        done();
      });
    });

    it('should the added product be in the store', (done) => {
      Products.list$({}, (err, products) => {
        expect(err).to.be.null;
        expect(products).to.have.length(1);
        expect(products[0].data$(false)).to.deep.equal(body);
        done();
      });
    });
  });

  describe('Fetch Product Action', () => {
    let seneca = null;
    let Products = null;
    let body = {};

    before((done) => {
      seneca = Seneca().test(done).use('entity').use('mem-store').use(Plugin);
      Products = seneca.make('products');
      body = {
        name: 'Test Product',
        category: 'Category',
        description: 'Description',
        price: 12.75
      };
      Products.make$().save$(body, (err, result) => {
        expect(err).to.be.null;
        body.id = result.id;
        done();
      });
    });

    after((done) => {
      Products.remove$(body.id, (err) => {
        expect(err).to.be.null;
        done();
      });
    });

    it('should fetch all products', (done) => {
      seneca.act({ role: 'product', cmd: 'fetch' }, (err, result) => {
        expect(err).to.be.null;
        expect(result).to.have.length(1);
        done();
      });
    });

    it('should fetch product by Id param', (done) => {
      const args = {params: {id: body.id}};
      seneca.act({ role: 'product', cmd: 'fetch', args }, (err, result) => {
        expect(err).to.be.null;
        expect(result.data$(false)).to.deep.equal(body);
        done();
      });
    });

    it('should fetch product by Id criteria', (done) => {
      seneca.act({ role: 'product', cmd: 'fetch', criteria: 'byId', id: body.id }, (err, result) => {
        expect(err).to.be.null;
        expect(result.data$(false)).to.deep.equal(body);
        done();
      });
    });

    it('should fetch product by category param', (done) => {
      const args = {query: {category: body.category}};
      seneca.act({ role: 'product', cmd: 'fetch', args }, (err, result) => {
        expect(err).to.be.null;
        expect(result).to.have.length(1);
        expect(result[0].data$(false)).to.deep.equal(body);
        done();
      });
    });

    it('should fetch product by category criteria', (done) => {
      seneca.act({ role: 'product', cmd: 'fetch', criteria: 'byCategory', category: body.category }, (err, result) => {
        expect(err).to.be.null;
        expect(result).to.have.length(1);
        expect(result[0].data$(false)).to.deep.equal(body);
        done();
      });
    });
  });
});
