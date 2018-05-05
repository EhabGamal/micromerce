const routes = [{
  prefix: '/products',
  pin: 'role:product,cmd:*',
  map: {
    fetch: {
      GET: true,
      suffix: '/:id?'
    },
    add: {
      POST: true
    },
    edit: {
      PUT: true,
      suffix: '/:id'
    },
    remove: {
      DELETE: true,
      suffix: '/:id'
    }
  }
}]

module.exports = routes;
