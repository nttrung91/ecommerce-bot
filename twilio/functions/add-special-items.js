const axios = require('axios');

exports.handler = function(context, event, callback) {
  axios({
    method: 'POST',
    url:
      'https://universal-ecommerce-bot.herokuapp.com/api/cart/add-special-items',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(response => {
    const { products, order, jsessionid, auth } = response.data;

    callback(null, {
      actions: [
        {
          remember: {
            products,
            order,
            jsessionid,
            auth
          }
        },
        {
          redirect: 'https://glaucous-lapwing-1943.twil.io/show-cart'
        }
      ]
    });
  });
};
