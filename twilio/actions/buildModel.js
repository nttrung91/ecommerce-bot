const buildModel = client => async uniqueName =>
  client.autopilot
    .assistants(process.env.ASSISTANT_SID)
    .modelBuilds.create({ uniqueName });

module.exports = buildModel;
