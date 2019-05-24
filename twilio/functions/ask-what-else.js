exports.handler = function(context, event, callback) {
  callback(null, {
    actions: [
      {
        say: 'What else could we help you with today?'
      },
      {
        listen: {
          tasks: [
            'view-cart',
            'track-recent-order',
            'track-open-orders',
            'place-pick-up-order',
            'add-special-items'
          ]
        }
      }
    ]
  });
};
