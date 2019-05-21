const async = require('async');

const createTasks = client => async tasks =>
  new Promise((resolve, reject) => {
    async.each(
      tasks,
      async ({ name, actions }, cb) => {
        await client.autopilot
          .assistants(process.env.ASSISTANT_SID)
          .tasks.create({
            uniqueName: name,
            actions: {
              actions: actions
            }
          })
          .catch(e => console.log(e.message))
          .done();

        cb();
      },
      err => {
        if (err) {
          return reject('There is an issue while creating tasks.');
        }

        return resolve('All tasks are created successfully.');
      }
    );
  });

module.exports = createTasks;
