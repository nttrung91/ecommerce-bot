const axios = require('axios');

exports.handler = function(context, event, callback) {
  const fulfillment = event.Field_FulfillmentType_Value;
  const date = event.Field_Date_Value;

  axios({
    method: 'POST',
    url: 'https://universal-ecommerce-bot.herokuapp.com/api/account/login',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    data: { fulfillment, date }
  }).then(response => {
    const { products, order, jsessionid } = response.data;

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
  });
};
