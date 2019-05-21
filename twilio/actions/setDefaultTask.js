const setDefaultTask = client => async tasks =>
  new Promise((resolve, reject) => {
    const defaultTask = tasks.filter(task => task.default)[0];
    const taskName = `task://${defaultTask.name}`;

    client.autopilot
      .assistants(process.env.ASSISTANT_SID)
      .defaults()
      .update({
        defaults: {
          defaults: {
            assistant_initiation: taskName,
            fallback: taskName
          }
        }
      })
      .then(defaults => resolve(defaults))
      .catch(err => reject(err.message));
  });

module.exports = setDefaultTask;
