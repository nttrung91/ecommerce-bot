const async = require('async');
const tasks = require('./tasks');

const Twilio = (accountSid, authToken) => {
  const client = require('twilio')(accountSid, authToken);

  const createTasks = async () => {
    return async.each(
      tasks,
      async function(task, cb) {
        await client.autopilot
          .assistants(process.env.ASSISTANT_SID)
          .tasks.create({
            uniqueName: task.name,
            actions: {
              actions: task.actions
            }
          })
          .catch(e => console.log(e.message))
          .done();

        cb();
      },
      function(error) {
        if (error) {
          console.log('A file failed to process');
        } else {
          console.log('All files have been processed successfully');
        }
      }
    );
  };

  const start = async () => {
    // Create task
    await createTasks();
  };

  return {
    start
  };
};

module.exports = Twilio;
