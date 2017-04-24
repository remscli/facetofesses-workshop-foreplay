var RangeScaler = function (params) {
  this.value = params.value;
  this.range = params.range;
};

RangeScaler.prototype.scaleTo = function(min, max) {
  return min + (this.value - this.range.min) / (this.range.max - this.range.min) * (max - min)
};

module.exports = RangeScaler;