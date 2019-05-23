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
