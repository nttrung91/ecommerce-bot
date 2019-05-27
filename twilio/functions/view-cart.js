const axios = require('axios');

exports.handler = function(context, event, callback) {
  axios({
    method: 'POST',
    url: 'https://universal-ecommerce-bot.herokuapp.com/api/account/login',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(response => {
    const { products, order, jsessionid } = response.data;

    if (products.length === 0) {
      return callback(null, {
        actions: [
          {
            say:
              "Your cart is currently empty. To build cart, you can say things like 'Build my basket'"
          },
          {
            redirect: 'https://glaucous-lapwing-1943.twil.io/ask-what-else'
          }
        ]
      });
    }

    callback(null, {
      actions: [
        {
          remember: {
            products,
            order,
            jsessionid
          }
        },
        {
          redirect: 'https://glaucous-lapwing-1943.twil.io/show-cart'
        }
      ]
    });
  });
};
