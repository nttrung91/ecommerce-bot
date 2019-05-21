const setDefaultTask = client => async tasks => {
  const defaultTask = tasks.filter(task => task.default)[0];
  const taskName = `task://${defaultTask.name}`;

  return client.autopilot
    .assistants(process.env.ASSISTANT_SID)
    .defaults()
    .update({
      defaults: {
        defaults: {
          assistant_initiation: taskName,
          fallback: taskName
        }
      }
    });
};

module.exports = setDefaultTask;
