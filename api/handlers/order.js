const _ = require('lodash');
const axios = require('axios');
const Boom = require('boom');

module.exports.placeOrder = {
  handler: async (request, reply) => {
    const loginResponse = await axios.post(
      'https://super-qa.walmart.com.mx/api/rest/model/atg/userprofiling/ProfileActor/login',
      {
        email: 'trung3300@gmail.com',
        password: 'abcd1234',
        storeId: '0000009999'
      }
    );

    const jsessionId = _.get(loginResponse.data, 'jsessionid');
    const cookie = `JSESSIONID_GR=${jsessionId}`;

    try {
      const initiateCheckoutResponse = await axios(
        'https://super-qa.walmart.com.mx/api/rest/model/atg/commerce/order/purchase/ShippingGroupActor/initiateCheckout',
        {
          method: 'post',
          headers: {
            Accept: 'text/plain',
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
            Accept: 'text/plain',
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

    const slotId = _.get(displaySlotsResponse, 'data.slots_4[0].slotId');

    if (!slotId) {
      return reply(Boom.badRequest('Slot is empty'));
    }

    try {
      const selectedSlot = await axios(
        'https://super-qa.walmart.com.mx/api/rest/model/atg/commerce/order/purchase/ShippingGroupActor/selectedSlot',
        {
          method: 'post',
          headers: {
            Accept: 'text/plain',
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

      debugger;
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
            Accept: 'text/plain',
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
            Accept: 'text/plain',
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
            Accept: 'text/plain',
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
