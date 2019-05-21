'use strict';

require('dotenv').config();

const Glue = require('glue');
const manifest = require('./config/manifest');
const Twilio = require('./twilio');

const { ACCOUNT_SID, AUTH_TOKEN } = process.env;

if (!process.env.PRODUCTION) {
  manifest.registrations.push({
    plugin: {
      register: 'blipp',
      options: {}
    }
  });
}

const twilio = Twilio(ACCOUNT_SID, AUTH_TOKEN);
twilio.start();

// Start Hapi services
Glue.compose(
  manifest,
  { relativeTo: __dirname },
  (err, server) => {
    if (err) {
      console.log('server.register err:', err);
    }
    server.start(() => {
      console.log(
        '✅  Server is listening on ' + server.info.uri.toLowerCase()
      );
    });
  }
);
