const Home = require('./handlers/home');
const Order = require('./handlers/order');

exports.register = (plugin, options, next) => {
  plugin.route([
    { method: 'GET', path: '/', config: Home.hello },
    { method: 'GET', path: '/restricted', config: Home.restricted },
    { method: 'GET', path: '/{path*}', config: Home.notFound },
    { method: 'POST', path: '/place-order', config: Order.placeOrder }
  ]);

  next();
};

exports.register.attributes = {
  name: 'api'
};
