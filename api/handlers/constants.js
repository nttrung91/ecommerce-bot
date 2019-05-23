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
