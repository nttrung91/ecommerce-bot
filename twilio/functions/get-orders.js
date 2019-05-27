const axios = require('axios');

exports.handler = function(context, event, callback) {
  axios
    .get('https://universal-ecommerce-bot.herokuapp.com/api/account/orders')
    .then(response => {
      const { orders, jsessionid } = response.data;

      callback(null, {
        actions: [
          {
            remember: {
              orders,
              jsessionid
            }
          },
          {
            redirect: 'https://glaucous-lapwing-1943.twil.io/show-open-orders'
          }
        ]
      });
    });
};
