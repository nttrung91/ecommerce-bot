const Home = require('./handlers/home');
const Account = require('./handlers/account');
const Checkout = require('./handlers/checkout');

exports.register = (plugin, options, next) => {
  plugin.route([
    { method: 'GET', path: '/', config: Home.hello },
    { method: 'GET', path: '/restricted', config: Home.restricted },
    { method: 'GET', path: '/{path*}', config: Home.notFound },
    { method: 'POST', path: '/account/login', config: Account.login },
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
