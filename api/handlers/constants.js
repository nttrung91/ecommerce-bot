const delivery = 'ship';
const pickup = 'pickup';

module.exports.DELIVERY = delivery;
module.exports.PICKUP = pickup;

module.exports.FULFILLMENT_TYPES = {
  [delivery]: 'hardgoodShippingGroup',
  [pickup]: 'inStorePickupShippingGroup'
};

module.exports.SLOT_FULFILLMENT_TYPES = {
  [delivery]: 'Ship',
  [pickup]: 'StorePickup'
};

module.exports.ORDER_STATUS = {
  SENT_TO_STORE: 'Your order is on the way',
  PACK_COMPLETE: 'Your order is ready to deliver',
  ORDER_DELIVERED: 'Your order is delivered',
  ORDER_CANCELLED: 'Your order is cancelled',
  SENT_TO_FULFILLMENT: 'Your order is on the way'
};
