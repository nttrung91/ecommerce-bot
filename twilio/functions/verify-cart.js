const _ = require('lodash');

exports.handler = function(context, event, callback) {
  const memory = event.Memory;
  const {
    products,
    order: { priceInfo = {} }
  } = JSON.parse(memory);
  const { subtotal, delivery, discount, total } = priceInfo;
  const items = _.join(
    products.map(
      product => `${product.quantity}x ${product.name} – ${product.amount} \n`
    ),
    ''
  );

  const priceSummary = `Subtotal: ${subtotal}\nDelivery: ${delivery}\nDiscount: ${discount}\nTotal: ${total}`;

  callback(null, {
    actions: [
      {
        say: `Your cart: \n\n${items}\n----------\n${priceSummary}\n.\n.\n`
      },
      {
        collect: {
          name: 'proceed_next_step_question',
          questions: [
            {
              question:
                '\nGreat, we saved your preference. Would you like to place this order?',
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
