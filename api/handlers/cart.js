const _ = require('lodash');
const Boom = require('boom');

const { login } = require('../gr/account');
const {
  getSpecialList,
  addSpecialItems: addSpecialItemsApi
} = require('../gr/cart');
const { normalizeOrder, normalizeProducts } = require('./normalizr');

module.exports.addSpecialItems = {
  handler: async (request, reply) => {
    let jsessionid = (request.payload || {}).jsessionid;
    let cookie;

    if (!jsessionid) {
      const loginResponse = await login({
        email: 'trung3300@gmail.com',
        password: 'abcd1234',
        storeId: '0000003852'
      });
      jsessionid = _.get(loginResponse.data, 'jsessionid');
    }

    cookie = `JSESSIONID_GR=${jsessionid};`;

    // let getSpecialListResponse;
    // try {
    //   getSpecialListResponse = await getSpecialList();
    // } catch (err) {
    //   return reply(Boom.badRequest(err.message));
    // }

    let addSpecialItemsResponse;
    try {
      addSpecialItemsResponse = await addSpecialItemsApi({
        headers: {
          cookie
        },
        data: {
          items: [
            {
              productId: '00750105590027',
              catalogRefId: '00750105590027',
              quantity: 1,
              orderedUom: 'EA',
              orderedQtyWeight: 0,
              storeId: '0000003852'
            },
            {
              productId: '00807680953135',
              catalogRefId: '00807680953135',
              quantity: 1,
              orderedUom: 'EA',
              orderedQtyWeight: 0,
              storeId: '0000003852'
            },
            {
              productId: '00750104540314',
              catalogRefId: '00750104540314',
              quantity: 1,
              orderedUom: 'EA',
              orderedQtyWeight: 0,
              storeId: '0000003852'
            }
          ],
          addItemCount: 3
        }
      });
    } catch (err) {
      return reply(Boom.badRequest(err.message));
    }

    let result = Object.assign(
      {
        products: normalizeProducts(addSpecialItemsResponse.data.order)
      },
      { jsessionid }
    );

    result = Object.assign(result, {
      order: normalizeOrder(addSpecialItemsResponse.data.order)
    });

    return reply(result);
  }
};
