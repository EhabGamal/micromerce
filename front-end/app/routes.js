const routes = [{
  prefix: '/api',
  pin: 'role:api,cmd:*',
  map: {
    products: {
      GET: true,
      suffix: '/:id?'
    },
    get: {
      GET: true
    }
  }
}, {
  prefix: '/api/order',
  pin: 'role:api,cmd:order,action:*',
  map: {
    create: {
      POST: true
    },
    fetch: {
      GET: true,
      suffix: '/:id?'
    }
  }
}];

module.exports = routes;
