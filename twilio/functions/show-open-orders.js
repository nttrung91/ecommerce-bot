const _ = require('lodash');

exports.handler = function(context, event, callback) {
  const memory = event.Memory;
  const { orders } = JSON.parse(memory);
  const openOrders = orders.filter(
    order => !_.includes(order.state, ['ORDER_DELIVERED'])
  );
  let result = _.join(
    _.take(openOrders, 5).map(
      ({ id, date, status }) =>
        `\nOrder#${id}\nDate: ${date}\nStatus: ${status}\n`
    ),
    '---'
  );

  callback(null, {
    actions: [
      {
        say: `${result}\n.`
      },
      {
        redirect: 'https://glaucous-lapwing-1943.twil.io/ask-what-else'
      }
    ]
  });
};
