const axios = require('axios');

exports.handler = function(context, event, callback) {
  const memory = event.Memory;
  const { order, jsessionid, auth } = JSON.parse(memory);
  const orderId = order.id;

  axios({
    method: 'POST',
    url:
      'https://universal-ecommerce-bot.herokuapp.com/api/checkout/place-order',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    data: { orderId, jsessionid, auth }
  }).then(() => {
    callback(null, {
      actions: [
        {
          say: 'We got your order. You can text me anytime to track your order'
        },
        {
          listen: true
        }
      ]
    });
  });
};
