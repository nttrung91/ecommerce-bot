const axios = require('axios');
const _ = require('lodash');

exports.handler = function(context, event, callback) {
  const fulfillment = event.Field_FulfillmentType_Value;
  const date = event.Field_Date_Value;

  axios.post('https://universal-ecommerce-bot.herokuapp.com/api/place-order', {
    fulfillment,
    date
  });

  callback(null, {
    actions: [
      {
        say: `Your order has been placed successfully. Thank you for shopping at Walmart!`
      }
    ]
  });
};
