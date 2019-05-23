const _ = require('lodash');

exports.handler = function(context, event, callback) {
  const memory = event.Memory;
  const { products } = JSON.parse(memory);
  const items = _.join(
    products.map(product => `${product.quantity}x ${product.name} \n`),
    ''
  );

  callback(null, {
    actions: [
      {
        say: `Your cart: \n\n${items}\n----------\n`
      },
      {
        collect: {
          name: 'Proceed to select slot',
          questions: [
            {
              question: '\nWould you like to proceed?',
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
