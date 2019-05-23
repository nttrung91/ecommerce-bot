const _ = require('lodash');
const moment = require('moment');

module.exports.is5DaysFromToday = date =>
  moment(date).isBetween(moment(), moment().add(5, 'days'));

module.exports.getActiveSlots = raw => {
  const listOfSlots = _.filter(raw, (_, key) => Boolean(key.match(/slots_/i)));
  const listOfActiveSlots = listOfSlots.map(slots =>
    slots.filter(
      slot => slot.isSlotAvailable && !slot.isSlotExpired && slot.isValid
    )
  );
  return listOfActiveSlots;
};

module.exports.getEarliestActiveSlot = slots => _.get(slots, '[0][0]', {});
