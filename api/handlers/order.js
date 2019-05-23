const _ = require('lodash');
const Boom = require('boom');
const moment = require('moment');

const { login } = require('../gr/account');
const {
  initiateCheckout,
  displaySlots,
  selectSlot,
  reserveSlot,
  applyPaymentType,
  placeOrder
} = require('../gr/checkout');

const is5DaysFromToday = date =>
  moment(date).isBetween(moment(), moment().add(5, 'days'));

const getActiveSlots = raw => {
  const listOfSlots = _.filter(raw, (_, key) => Boolean(key.match(/slots_/i)));
  const listOfActiveSlots = listOfSlots.map(slots =>
    slots.filter(
      slot => slot.isSlotAvailable && !slot.isSlotExpired && slot.isValid
    )
  );
  return listOfActiveSlots;
};

const getEarliestActiveSlot = slots => _.get(slots, '[0][0]', {});

const DELIVERY = 'ship';
const PICK_UP = 'pickup';

const FULFILLMENT_TYPES = {
  [DELIVERY]: 'hardgoodShippingGroup',
  [PICK_UP]: 'inStorePickupShippingGroup'
};

const SLOT_FULFILLMENT_TYPES = {
  [DELIVERY]: 'StorePickup',
  [PICK_UP]: 'Ship'
};

module.exports.placeOrder = {
  handler: async (request, reply) => {
    const { fulfillment = DELIVERY, date } = request.payload;
    const fulfillmentType = FULFILLMENT_TYPES[fulfillment.toLowerCase()];
    const slotFulfillmentType =
      SLOT_FULFILLMENT_TYPES[fulfillment.toLowerCase()];
    let jsessionId, cookie;

    if (!is5DaysFromToday(date)) {
      return reply(Boom.notAcceptable('Date is invalid'));
    }

    const loginResponse = await login({
      email: 'trung3300@gmail.com',
      password: 'abcd1234',
      storeId: '0000003852'
    });

    jsessionId = _.get(loginResponse.data, 'jsessionid');
    cookie = `JSESSIONID_GR=${jsessionId};`;

    /* Initiate Checkout */
    try {
      await initiateCheckout({
        headers: {
          cookie
        },
        data: {
          shippingMethod: fulfillmentType
        }
      });
    } catch (err) {
      return reply(Boom.badRequest(err.message));
    }

    let displaySlotsResponse;

    try {
      displaySlotsResponse = await displaySlots({
        headers: {
          cookie
        },
        params: {
          deliveryType: slotFulfillmentType,
          zipCode: '01110',
          storeId: '0000003852',
          isShippingStore: true
        }
      });
    } catch (err) {
      return reply(Boom.badRequest(err.message));
    }

    const activeSlots = getActiveSlots(displaySlotsResponse.data);
    const earliestActiveSlot = getEarliestActiveSlot(activeSlots);
    const earliestActiveSlotId = earliestActiveSlot.slotId;

    if (!earliestActiveSlotId) {
      return reply(Boom.notAcceptable('Slot is not available'));
    }

    try {
      await selectSlot({
        headers: {
          cookie
        },
        data: {
          deliveryType: slotFulfillmentType,
          selectedSlotId: earliestActiveSlotId,
          zipCode: '01110',
          storeId: '0000003852'
        }
      });
    } catch (err) {
      return reply(Boom.badRequest(err.message));
    }

    let reserveSlotResponse = '';

    try {
      reserveSlotResponse = await reserveSlot({
        headers: {
          cookie
        },
        data: {
          deliveryType: slotFulfillmentType
        }
      });
    } catch (err) {
      return reply(Boom.badRequest(err.message));
    }

    const basketId = _.get(reserveSlotResponse, 'data.order.id');

    try {
      await applyPaymentType({
        headers: {
          cookie
        },
        data: {
          basketId,
          paymentMethod: 'onDeliveryPayment',
          paymentMode: 'creditDebit'
        }
      });
    } catch (err) {
      return reply(Boom.badRequest(err.message));
    }

    try {
      await placeOrder({
        headers: {
          cookie
        },
        data: {
          basketId,
          device: '23'
        }
      });
    } catch (err) {
      return reply(Boom.badRequest(err.message));
    }

    return reply({ result: basketId });
  },
  payload: {
    output: 'data',
    parse: true
  }
};
