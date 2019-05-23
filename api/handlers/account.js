const _ = require('lodash');
const Boom = require('boom');

const { FULFILLMENT_TYPES, DELIVERY } = require('./constants');
const { login } = require('../gr/account');
const { initiateCheckout } = require('../gr/checkout');
const { is5DaysFromToday } = require('./utils');

const normalizeResult = order => {
  return _.get(order, 'commerceItems', []).map(item => ({
    sku: item.productId,
    quantity: item.quantity,
    name: item.productDisplayName,
    imageSrc: `https://super-qa.walmart.com.mx/images/product-images/img_small/${
      item.productId
    }s.jpg`
  }));
};

module.exports.login = {
  handler: async (request, reply) => {
    const { fulfillment = DELIVERY, date } = request.payload;
    const fulfillmentType = FULFILLMENT_TYPES[fulfillment.toLowerCase()];
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
    let initiateCheckoutResponse;

    try {
      initiateCheckoutResponse = await initiateCheckout({
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
      { products: normalizeResult(initiateCheckoutResponse.data.order) },
      { jsessionid: initiateCheckoutResponse.data.jsessionid }
    );

    result = Object.assign(result, {
      orderId: initiateCheckoutResponse.data.order.id
    });

    return reply(result);
  },
  payload: {
    output: 'data',
    parse: true
  }
};
