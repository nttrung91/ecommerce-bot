const accountSid = 'AC58de5488d06d5f52f1d577e2c87c36e5';
const authToken = '206c0df69c5601339b277ef266b2be5f';
const client = require('twilio')(accountSid, authToken);

const Twilio = () => {
  const start = () =>
    client.autopilot.assistants
      .create({
        friendlyName: 'Quickstart Assistant',
        uniqueName: 'quickstart-assistant'
      })
      .then(assistant => {
        console.log('twilio');
        return console.log(assistant.sid);
      })
      .catch(err => console.log(err));

  return {
    start
  };
};

module.exports = Twilio;
