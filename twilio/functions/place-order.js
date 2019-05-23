const axios = require('axios');

exports.handler = function(context, event, callback) {
  const memory = event.Memory;
  const { order, jsessionid } = JSON.parse(memory);
  const orderId = order.id;

  axios({
    method: 'POST',
    url:
      'https://universal-ecommerce-bot.herokuapp.com/api/checkout/place-order',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    data: { orderId, jsessionid }
  }).then(() => {
    callback(null, {
      actions: [
        {
          say: `Your order #${orderId} has been placed sucessfully.\nIs there anything else we could help you with?`
        },
        {
          listen: true
        }
      ]
    });
  });
};
