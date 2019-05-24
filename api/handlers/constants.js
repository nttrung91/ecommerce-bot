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
  SENT_TO_STORE: 'Enviado a Tienda',
  PACK_COMPLETE: 'Listo para entregar',
  ORDER_DELIVERED: 'Entregado',
  ORDER_CANCELLED: 'Cancelado',
  SENT_TO_FULFILLMENT: 'Enviado a Tienda'
};
