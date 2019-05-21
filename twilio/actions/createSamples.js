const async = require('async');

const createSamples = client => async samples =>
  new Promise((resolve, reject) => {
    async.each(
      samples,
      async ({ task: taskName, phrases }, cb) => {
        await async.each(
          phrases,
          async (phrase, cb2) => {
            await client.autopilot
              .assistants(process.env.ASSISTANT_SID)
              .tasks(taskName)
              .samples.create({
                language: 'en-us',
                taggedText: phrase
              })
              .catch(e => console.log(e.message))
              .done();

            cb2();
          },
          err => {
            if (err) {
              return reject('There is an issue while creating samples.');
            }

            return resolve('All samples are created successfully.');
          }
        );

        cb();
      },
      err => {
        if (err) {
          return reject('There is an issue while creating samples.');
        }

        console.log('All samples are created successfully.');
        return resolve('All samples are created successfully.');
      }
    );
  });

module.exports = createSamples;
