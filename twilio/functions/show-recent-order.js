const _ = require('lodash');

exports.handler = function(context, event, callback) {
  const memory = event.Memory;
  const { orders } = JSON.parse(memory);

  callback(null, {
    actions: [
      {
        say: `${orders[0].status}\n.`
      },
      {
        redirect: 'https://glaucous-lapwing-1943.twil.io/ask-what-else'
      }
    ]
  });
};
