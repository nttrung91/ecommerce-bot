const axios = require('axios');
const _ = require('lodash');

exports.handler = function(context, event, callback) {
  axios
    .post('https://universal-ecommerce-bot.herokuapp.com/api/place-order')
    .then(response => {
      return callback(null, {
        actions: [
          {
            say: `Your order#${_.get(
              response,
              'data.result'
            )} has been placed successfully. Thank you for shopping at Walmart!`
          }
        ]
      });
    });
};
