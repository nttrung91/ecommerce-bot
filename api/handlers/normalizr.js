const _ = require('lodash');
const { getTotalDiscountAmount, getFormattedPrice } = require('./utils');
const paths = require('../paths');

module.exports.normalizeResult = order =>
  _.get(order, 'commerceItems', []).map(item => ({
    sku: item.productId,
    quantity: item.quantity,
    name: item.productDisplayName,
    amount: getFormattedPrice(item.priceInfo.amount),
    imageSrc: `${paths.domain}/images/product-images/img_small/${
      item.productId
    }s.jpg`
  }));

const normalizeOrderPrice = order => {
  const orderLevelDiscountAmount = getTotalDiscountAmount(
    _.get(order, 'priceInfo.adjustments', [])
  );
  const shippingLevelDiscountAmount = getTotalDiscountAmount(
    _.get(order, 'shippingGroups["0"].priceInfo.adjustments', [])
  );
  const totalDiscount = orderLevelDiscountAmount + shippingLevelDiscountAmount;
  const total = _.get(order, 'priceInfo.total', 0);
  const totalFinal = _.get(order, 'priceInfo.finalOrderTotal', 0);
  const adjustment = !!totalFinal && totalFinal - total;

  return {
    subtotal: getFormattedPrice(_.get(order, 'priceInfo.rawSubtotal', 0)),
    delivery: getFormattedPrice(
      _.get(order, 'shippingGroups["0"].priceInfo.rawShipping', 0)
    ),
    discount: getFormattedPrice(totalDiscount),
    total: getFormattedPrice(total),
    adjustment,
    totalFinal
  };
};

module.exports.normalizeOrder = order => ({
  id: order.id,
  priceInfo: normalizeOrderPrice(order)
});