const axios = require('axios');

exports.handler = function(context, event, callback) {
  const date = event.Field_Date_Value;
  const fulfillment = 'pickup';

  axios({
    method: 'POST',
    url:
      'https://universal-ecommerce-bot.herokuapp.com/api/checkout/initiate-checkout',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    data: { fulfillment, date }
  })
    .then(response => {
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
              order,
              fulfillment,
              products,
              jsessionid
            }
          },
          {
            redirect: 'https://glaucous-lapwing-1943.twil.io/validate-cart'
          }
        ]
      });
    })
    .catch(error => {
      callback(null, {
        actions: [
          {
            say: 'There is no slot for this date or time.'
          },
          {
            redirect: 'https://glaucous-lapwing-1943.twil.io/ask-what-else'
          }
        ]
      });
    });
};
