const axios = require('axios');
const _ = require('lodash');

exports.handler = function(context, event, callback) {
  const memory = event.Memory;
  const { fulfillment, jsessionid, twilio, auth } = JSON.parse(memory);
  const answer = _.get(
    twilio,
    'collected_data.proceed_next_step_question.answers.proceed_next_step.answer',
    ''
  );

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
    return axios({
      method: 'POST',
      url:
        'https://universal-ecommerce-bot.herokuapp.com/api/checkout/reserve-slot',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      data: { jsessionid, fulfillment, auth }
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
          name: 'proceed_next_step_question',
          questions: [
            {
              question:
                '\nI am not sure what you mean. Do you want to proceed?',
              name: 'proceed_next_step',
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
