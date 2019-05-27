exports.handler = function(context, event, callback) {
  callback(null, {
    actions: [
      {
        say:
          'How would you like to proceed?\nYou can say things like\n• pickup tomorrow\n• deliver today\nand we will set you up with the earliest available slot'
      },
      {
        listen: {
          tasks: [
            'view-cart',
            'track-recent-order',
            'track-open-orders',
            'place-pick-up-order',
            'place-delivery-order',
            'add-special-items'
          ]
        }
      }
    ]
  });
};
