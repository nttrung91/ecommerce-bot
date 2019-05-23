const axios = require('axios');
const _ = require('lodash');

exports.handler = function(context, event, callback) {
  const memory = event.Memory;
  const answer = event.CurrentInput;
  const { fulfillment, jsessionid } = JSON.parse(memory);

  if (answer === 'No') {
    return callback(null, {
      actions: [
        {
          say: 'Is there anything I could help you with?'
        },
        {
          listen: true
        }
      ]
    });
  }

  if (answer === 'Yes') {
    axios({
      method: 'POST',
      url:
        'https://universal-ecommerce-bot.herokuapp.com/api/checkout/reserve-slot',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      data: { jsessionid, fulfillment }
    }).then(() => {
      callback(null, {
        actions: [
          {
            redirect: 'https://glaucous-lapwing-1943.twil.io/place-order'
          }
        ]
      });
    });
  }

  return callback(null, {
    actions: [
      {
        collect: {
          name: 'Proceed to select slot',
          questions: [
            {
              question:
                '\nI am not really sure what you mean. Do you still like to proceed?',
              name: 'proceed_to_slot',
              type: 'Twilio.YES_NO'
            }
          ],
          on_complete: {
            redirect: 'https://glaucous-lapwing-1943.twil.io/reserve-slot'
          }
        }
      }
    ]
  });
};
