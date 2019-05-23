const axios = require('axios');
const paths = require('../paths');

module.exports.initiateCheckout = ({ headers, data }) =>
  axios(
    `${
      paths.domain
    }/api/rest/model/atg/commerce/order/purchase/ShippingGroupActor/initiateCheckout`,
    {
      method: 'post',
      headers: Object.assign(
        {
          Accept: 'application/json',
          pragma: 'no-cache'
        },
        headers
      ),
      data,
      withCredentials: true
    }
  );

module.exports.displaySlots = ({ headers, params }) =>
  axios.get(
    `${
      paths.domain
    }/api/rest/model/atg/commerce/order/purchase/ShippingGroupActor/displaySlots`,
    {
      headers: Object.assign(
        {
          Accept: 'application/json',
          pragma: 'no-cache'
        },
        headers
      ),
      params,
      withCredentials: true
    }
  );

module.exports.selectSlot = ({ headers, data }) =>
  axios(
    `${
      paths.domain
    }/api/rest/model/atg/commerce/order/purchase/ShippingGroupActor/selectedSlot`,
    {
      method: 'post',
      headers: Object.assign(
        {
          Accept: 'application/json',
          pragma: 'no-cache'
        },
        headers
      ),
      data,
      withCredentials: true
    }
  );

module.exports.reserveSlot = ({ headers, data }) =>
  axios(
    `${
      paths.domain
    }/api/rest/model/atg/commerce/order/purchase/ShippingGroupActor/reserveDeliverySlot`,
    {
      method: 'post',
      headers: Object.assign(
        {
          Accept: 'application/json',
          pragma: 'no-cache'
        },
        headers
      ),
      data,
      withCredentials: true
    }
  );

module.exports.applyPaymentType = async ({ headers, data }) =>
  axios(
    `${
      paths.domain
    }/api/rest/model/atg/commerce/order/purchase/PaymentGroupActor/applyPaymentType`,
    {
      method: 'post',
      headers: Object.assign(
        {
          Accept: 'application/json',
          pragma: 'no-cache'
        },
        headers
      ),
      data,
      withCredentials: true
    }
  );

module.exports.placeOrder = async ({ headers, data }) =>
  axios(
    `${
      paths.domain
    }/api/rest/model/atg/commerce/order/purchase/CommitOrderActor/commitOrder`,
    {
      method: 'post',
      headers: Object.assign(
        {
          Accept: 'application/json',
          pragma: 'no-cache'
        },
        headers
      ),
      data,
      withCredentials: true
    }
  );
