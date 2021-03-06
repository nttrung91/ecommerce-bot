const Home = require('./handlers/home');
const Checkout = require('./handlers/checkout');
const Cart = require('./handlers/cart');
const Account = require('./handlers/account');

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
    },
    {
      method: 'POST',
      path: '/cart/add-special-items',
      config: Cart.addSpecialItems
    },
    {
      method: 'GET',
      path: '/account/orders',
      config: Account.getOrders
    },
    {
      method: 'POST',
      path: '/account/login',
      config: Account.login
    }
  ]);

  next();
};

exports.register.attributes = {
  name: 'api'
};
