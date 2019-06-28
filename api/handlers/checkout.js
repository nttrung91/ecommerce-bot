const _ = require('lodash');
const Boom = require('boom');

const {
  DELIVERY,
  FULFILLMENT_TYPES,
  SLOT_FULFILLMENT_TYPES
} = require('./constants');
const { accountConfig } = require('../config');
const {
  normalizeOrder,
  normalizeProducts,
  normalizeSlot
} = require('./normalizr');
const { login } = require('../gr/account');
const {
  initiateCheckout: initiateCheckoutApi,
  displaySlots,
  selectSlot,
  reserveSlot,
  applyPaymentType,
  placeOrder
} = require('../gr/checkout');
const {
  is5DaysFromToday,
  getActiveSlots,
  getEarliestActiveSlot
} = require('./utils');

module.exports.initiateCheckout = {
  handler: async (request, reply) => {
    const { fulfillment = DELIVERY, date } = request.payload;
    const fulfillmentType = FULFILLMENT_TYPES[fulfillment.toLowerCase()];
    let jsessionid = request.payload.jsessionid;
    let cookie;

    if (!is5DaysFromToday(date)) {
      return reply(Boom.notAcceptable('Date is invalid'));
    }

    if (!jsessionid) {
      const loginResponse = await login({
        email: accountConfig.credential.username,
        password: accountConfig.credential.password,
        storeId: '0000003852'
      });
      jsessionid = _.get(loginResponse.data, 'jsessionid');
    }

    cookie = `JSESSIONID_GR=${jsessionid};`;

    /* Initiate Checkout */
    let initiateCheckoutResponse;

    try {
      initiateCheckoutResponse = await initiateCheckoutApi({
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

    let result = Object.assign(
      { products: normalizeProducts(initiateCheckoutResponse.data.order) },
      { jsessionid: initiateCheckoutResponse.data.jsessionid }
    );

    result = Object.assign(result, {
      order: normalizeOrder(initiateCheckoutResponse.data.order)
    });

    return reply(result);
  },
  payload: {
    output: 'data',
    parse: true
  }
};

module.exports.reserveSlot = {
  handler: async (request, reply) => {
    const { fulfillment = DELIVERY, jsessionid } = request.payload;
    const slotFulfillmentType =
      SLOT_FULFILLMENT_TYPES[fulfillment.toLowerCase()];
    const cookie = `JSESSIONID_GR=${jsessionid};`;
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

    const result = Object.assign(
      { slot: normalizeSlot(reserveSlotResponse.data.order) },
      { jsessionid: reserveSlotResponse.data.jsessionid }
    );

    return reply(result);
  },
  payload: {
    output: 'data',
    parse: true
  }
};

module.exports.placeOrder = {
  handler: async (request, reply) => {
    const { orderId, jsessionid } = request.payload;
    const cookie = `JSESSIONID_GR=${jsessionid};`;

    if (!orderId) {
      return reply(Boom.notAcceptable('Order is invalid'));
    }

    try {
      await applyPaymentType({
        headers: {
          cookie
        },
        data: {
          basketId: orderId,
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
          basketId: orderId,
          device: '23'
        }
      });
    } catch (err) {
      return reply(Boom.badRequest(err.message));
    }

    return reply({ result: orderId });
  },
  payload: {
    output: 'data',
    parse: true
  }
};
