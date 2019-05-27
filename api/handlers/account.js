const _ = require('lodash');
const Boom = require('boom');

const { login, getOrders } = require('../gr/account');
const {
  normalizeOrder,
  normalizeOrders,
  normalizeProducts
} = require('./normalizr');

module.exports.login = {
  handler: async (request, reply) => {
    const loginResponse = await login({
      email: 'trung3300@gmail.com',
      password: 'abcd1234',
      storeId: '0000003852'
    });
    const jsessionid = _.get(loginResponse.data, 'jsessionid');
    const order = _.get(loginResponse, 'data.addedItemDetails.order');

    const result = Object.assign(
      {
        order: normalizeOrder(order),
        products: normalizeProducts(order)
      },
      { jsessionid }
    );

    return reply(result);
  }
};

module.exports.getOrders = {
  handler: async (request, reply) => {
    let jsessionid = (request.payload || {}).jsessionid;
    let cookie;
    let getOrdersResponse;

    if (!jsessionid) {
      const loginResponse = await login({
        email: 'trung3300@gmail.com',
        password: 'abcd1234',
        storeId: '0000003852'
      });
      jsessionid = _.get(loginResponse.data, 'jsessionid');
    }

    cookie = `JSESSIONID_GR=${jsessionid};`;

    try {
      getOrdersResponse = await getOrders({
        headers: {
          cookie
        }
      });
    } catch (err) {
      return reply(Boom.badRequest(err.message));
    }

    const result = Object.assign(
      {
        orders: normalizeOrders(getOrdersResponse.data.orderMap)
      },
      { jsessionid }
    );

    return reply(result);
  }
};
