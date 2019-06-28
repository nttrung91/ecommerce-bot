const _ = require('lodash');
const Boom = require('boom');

const { login, getOrders } = require('../gr/account');
const { accountConfig } = require('../config');
const {
  normalizeOrder,
  normalizeOrders,
  normalizeProducts
} = require('./normalizr');

module.exports.login = {
  handler: async (request, reply) => {
    const loginResponse = await login({
      email: accountConfig.credential.username,
      password: accountConfig.credential.password,
      storeId: '0000003852'
    });
    const jsessionid = _.get(loginResponse.data, 'jsessionid');
    const auth = _.get(loginResponse.headers, 'wm_sec.refresh_auth_token');
    const order = _.get(loginResponse, 'data.addedItemDetails.order');

    const result = Object.assign(
      {
        order: order ? normalizeOrder(order) : {},
        products: normalizeProducts(order)
      },
      { jsessionid, auth }
    );

    return reply(result);
  }
};

module.exports.getOrders = {
  handler: async (request, reply) => {
    let jsessionid = (request.payload || {}).jsessionid;
    let auth = (request.payload || {}).auth;
    let cookie;
    let getOrdersResponse;

    if (!jsessionid) {
      const loginResponse = await login({
        email: accountConfig.credential.username,
        password: accountConfig.credential.password,
        storeId: '0000003852'
      });
      jsessionid = _.get(loginResponse.data, 'jsessionid');
      auth = _.get(loginResponse.headers, 'wm_sec.refresh_auth_token');
    }

    cookie = `JSESSIONID_GR=${jsessionid};auth=${encodeURIComponent(
      auth
    )};loggedInUserCookie=loggedIn;`;

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
