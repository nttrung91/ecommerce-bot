const _ = require('lodash');
const Boom = require('boom');

const { DELIVERY, SLOT_FULFILLMENT_TYPES } = require('./constants');
const {
  displaySlots,
  selectSlot,
  reserveSlot,
  applyPaymentType,
  placeOrder
} = require('../gr/checkout');
const { getActiveSlots, getEarliestActiveSlot } = require('./utils');

const normalizeOrder = order => ({
  orderId: order.id,
  slot: _.get(order, 'shippingGroups[0].slot', {})
});

module.exports.reserveSlot = {
  handler: async (request, reply) => {
    const { fulfillment = DELIVERY, jsessionId } = request.payload;
    const slotFulfillmentType =
      SLOT_FULFILLMENT_TYPES[fulfillment.toLowerCase()];
    const cookie = `JSESSIONID_GR=${jsessionId};`;
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
      { order: normalizeOrder(reserveSlotResponse.data.order) },
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
    const { orderId, jsessionId } = request.payload;
    const cookie = `JSESSIONID_GR=${jsessionId};`;

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
