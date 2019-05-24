const _ = require('lodash');

exports.handler = function(context, event, callback) {
  const memory = event.Memory;
  const { orders } = JSON.parse(memory);
  const openOrders = orders.filter(order =>
    _.includes(order.state, ['ORDER_DELIVERED'])
  );
  let result = _.join(
    openOrders.map(
      ({ id, date, status }) => `Order#${id}\nDate: ${date}\nStatus: ${status}`
    ),
    '\n'
  );

  callback(null, {
    actions: [
      {
        say: result
      },
      {
        redirect: 'https://glaucous-lapwing-1943.twil.io/ask-what-else'
      }
    ]
  });
};
