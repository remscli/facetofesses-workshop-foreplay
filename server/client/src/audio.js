/**
 * `Audio` constructor
 * @param params
 * @constructor
 */
var Audio = function(params) {
  this.filename = params.filename;
  this.loop = params.loop;
  this.type = params.type;
  this.volume = params.volume || 0.9;
  this._interval = params.interval || 0;
  this._rate = params.rate || 1;
};

/**
 * Getter/Setter for interval attribute
 * @param interval
 * @returns {*|Audio.interval|number|interval}
 */
Audio.prototype.interval = function (interval) {
  if (interval) this._interval = interval;
  return this._interval;
};

/**
 * Getter/Setter for rate attribute
 * @param rate
 * @returns {*|Audio.rate|number|rate}
 */
Audio.prototype.rate = function (rate) {
  if (rate) this._rate = rate;
  return this._rate;
};

module.exports = Audio;