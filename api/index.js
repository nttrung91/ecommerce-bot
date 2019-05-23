const Home = require('./handlers/home');
const Checkout = require('./handlers/checkout');

exports.register = (plugin, options, next) => {
  plugin.route([
    { method: 'GET', path: '/', config: Home.hello },
    { method: 'GET', path: '/restricted', config: Home.restricted },
    { method: 'GET', path: '/{path*}', config: Home.notFound },
    {
      method: 'POST',
      path: '/checkout/initiate-checkout',
      config: Checkout.initiateCheckout
    },
    {
      method: 'POST',
      path: '/checkout/reserve-slot',
      config: Checkout.reserveSlot
    },
    {
      method: 'POST',
      path: '/checkout/place-order',
      config: Checkout.placeOrder
    }
  ]);

  next();
};

exports.register.attributes = {
  name: 'api'
};
