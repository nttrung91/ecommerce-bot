const _ = require('lodash');
const axios = require('axios');
const Boom = require('boom');
const moment = require('moment');

const is5DaysFromToday = date =>
  moment(date).isBetween(moment(), moment().add(5, 'days'));

module.exports.placeOrder = {
  handler: async (request, reply) => {
    const { date, time } = request.payload;
    let jsessionId, cookie;

    if (!is5DaysFromToday(date)) {
      return reply(Boom.badRequest('Date is invalid'));
    }

    const daysFromNow = moment(date).fromNow();

    const loginResponse = await axios(
      'https://super-qa.walmart.com.mx/api/rest/model/atg/userprofiling/ProfileActor/login',
      {
        method: 'post',
        headers: {
          Accept: 'application/json'
        },
        data: {
          email: 'trung3300@gmail.com',
          password: 'abcd1234',
          storeId: '0000003852'
        },
        withCredentials: true
      }
    );

    jsessionId = _.get(loginResponse.data, 'jsessionid');
    cookie = `JSESSIONID_GR=${jsessionId};`;

    try {
      await axios(
        'https://super-qa.walmart.com.mx/api/rest/model/atg/commerce/order/purchase/ShippingGroupActor/initiateCheckout',
        {
          method: 'post',
          headers: {
            Accept: 'application/json',
            cookie
          },
          data: {
            shippingMethod: 'inStorePickupShippingGroup'
          },
          withCredentials: true
        }
      );
    } catch (err) {
      return reply(Boom.badRequest(err.message));
    }

    let displaySlotsResponse;

    try {
      displaySlotsResponse = await axios.get(
        'https://super-qa.walmart.com.mx/api/rest/model/atg/commerce/order/purchase/ShippingGroupActor/displaySlots',
        {
          headers: {
            Accept: 'application/json',
            cookie
          },
          params: {
            deliveryType: 'StorePickup',
            zipCode: '01110',
            storeId: '0000003852',
            isShippingStore: true
          },
          withCredentials: true
        }
      );
    } catch (err) {
      return reply(Boom.badRequest(err.message));
    }

    const slotId = _.get(displaySlotsResponse, 'data.slots_3[0].slotId');

    if (!slotId) {
      return reply(Boom.badRequest('Slot is empty'));
    }

    try {
      const selectedSlot = await axios(
        'https://super-qa.walmart.com.mx/api/rest/model/atg/commerce/order/purchase/ShippingGroupActor/selectedSlot',
        {
          method: 'post',
          headers: {
            Accept: 'application/json',
            'content-type': 'application/json',
            cookie
          },
          data: {
            deliveryType: 'StorePickup',
            selectedSlotId: slotId,
            zipCode: '01110',
            storeId: '0000003852'
          },
          withCredentials: true
        }
      );
    } catch (err) {
      return reply(Boom.badRequest(err.message));
    }

    let reserveSlotResponse = '';

    try {
      reserveSlotResponse = await axios(
        'https://super-qa.walmart.com.mx/api/rest/model/atg/commerce/order/purchase/ShippingGroupActor/reserveDeliverySlot',
        {
          method: 'post',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            cookie
          },
          data: {
            deliveryType: 'StorePickup'
          },
          withCredentials: true
        }
      );
    } catch (err) {
      return reply(Boom.badRequest(err.message));
    }

    const basketId = _.get(reserveSlotResponse, 'data.order.id');

    try {
      await axios(
        'https://super-qa.walmart.com.mx/api/rest/model/atg/commerce/order/purchase/PaymentGroupActor/applyPaymentType',
        {
          method: 'post',
          headers: {
            Accept: 'application/json',
            cookie
          },
          data: {
            basketId,
            paymentMethod: 'onDeliveryPayment',
            paymentMode: 'creditDebit'
          },
          withCredentials: true
        }
      );
    } catch (err) {
      return reply(Boom.badRequest(err.message));
    }

    try {
      await axios(
        'https://super-qa.walmart.com.mx/api/rest/model/atg/commerce/order/purchase/CommitOrderActor/commitOrder',
        {
          method: 'post',
          headers: {
            Accept: 'application/json',
            cookie
          },
          data: {
            basketId,
            device: '23'
          },
          withCredentials: true
        }
      );
    } catch (err) {
      return reply(Boom.badRequest(err.message));
    }

    return reply({ result: basketId });
  }
};
