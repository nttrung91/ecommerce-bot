const axios = require('axios');

module.exports.login = ({ email, password, storeId }) =>
  axios(
    'https://super-qa.walmart.com.mx/api/rest/model/atg/userprofiling/ProfileActor/login',
    {
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
    }
  );
