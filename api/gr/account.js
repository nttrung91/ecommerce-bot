const axios = require('axios');
const paths = require('../paths');

module.exports.login = ({ email, password, storeId }) =>
  axios(`${paths.domain}/api/rest/model/atg/userprofiling/ProfileActor/login`, {
    method: 'post',
    headers: {
      Accept: 'application/json'
    },
    data: {
      email,
      password,
      storeId
    },
    withCredentials: true
  });

module.exports.getOrders = ({ headers }) =>
  axios(
    `${
      paths.domain
    }/api/rest/model/atg/userprofiling/ProfileActor/customOrderLookUp`,
    {
      method: 'get',
      headers: Object.assign(
        {
          Accept: 'application/json',
          pragma: 'no-cache'
        },
        headers
      ),

      withCredentials: true
    }
  );
