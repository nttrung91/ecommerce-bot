const axios = require('axios');
const paths = require('../paths');

module.exports.getSpecialList = () =>
  axios.get(
    'http://10.118.72.85:9000/mx-gr/v1/customer/210169/shoppingList?enhanced=0'
  );

module.exports.addSpecialItems = ({ headers, data }) =>
  axios(
    `${
      paths.domain
    }/api/rest/model/atg/commerce/order/purchase/CartModifierActor/addMultipleItemsToOrder`,
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
