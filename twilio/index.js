const async = require('async');

// Actions
const createTasks = require('./actions/createTasks');
const createSamples = require('./actions/createSamples');
const setDefaultTask = require('./actions/setDefaultTask');

// Configs
const tasks = require('./configs/tasks');
const samples = require('./configs/samples');

const Twilio = (accountSid, authToken) => {
  const client = require('twilio')(accountSid, authToken);

  const start = async () => {
    // Create task
    // try {
    //   await createTasks(client)(tasks);
    // } catch (e) {
    //   console.log(e);
    // }
    // Create samples
    // try {
    //   await createSamples(client)(samples);
    // } catch (e) {
    //   console.log(e);
    // }

    // Set default task
    try {
      await setDefaultTask(client)(tasks);
    } catch (e) {
      console.log(e);
    }
  };

  return {
    start
  };
};

module.exports = Twilio;
