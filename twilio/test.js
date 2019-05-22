const axios = require('axios');
const _ = require('lodash');

exports.handler = function(context, event, callback) {
  let JSESSION_ID = '';
  let cookie = '';

  // Login
  axios
    .post(
      'https://super-qa.walmart.com.mx/api/rest/model/atg/userprofiling/ProfileActor/login',
      {
        email: 'trung3300@gmail.com',
        password: 'abcd1234',
        storeId: '0000009999'
      }
    )
    .then(function(response) {
      JSESSION_ID = response.data.jsessionid;
      cookie = `JSESSIONID_GR=${JSESSION_ID}`;
      console.log(cookie);
      console.log(1);

      return axios(
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
      ).then(function() {
        // Display Slots
        console.log(2);

        return axios
          .get(
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
          )
          .then(function(response) {
            const slotId = _.get(response, 'data.slots_0[0].slotId');
            console.log('slotId', slotId);

            return callback(null, {
              actions: [
                {
                  say: `Your order#${slotId} has been placed successfully. Thank you for shopping at Walmart!`
                }
              ]
            });
          });
      });
    }); // 1
};
