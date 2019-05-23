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

module.exports.getTotalDiscountAmount = coupons => {
  /*
    The operations below do two things
      1) Get only valid Coupons and Promotions
      2) Get the total amount
   */
  const totalDiscountAmount = coupons
    .filter(({ coupon, promotion }) => coupon !== null || promotion !== null)
    .reduce((accum, curr) => accum + curr.totalAdjustment, 0);

  return Math.abs(totalDiscountAmount);
};
