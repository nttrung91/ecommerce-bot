'use strict';

const Glue = require('glue');
const manifest = require('./config/manifest');
const Twilio = require('./twilio');

if (!process.env.PRODUCTION) {
  manifest.registrations.push({
    plugin: {
      register: 'blipp',
      options: {}
    }
  });
}

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

      // Start Twilio
      const twilio = Twilio();
      twilio.start();
    });
  }
);
