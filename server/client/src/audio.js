var Audio = function(params) {
  this.filename = params.filename;
  this.loop = params.loop;
  this._interval = params.interval;
  this._rate = params.rate;
};

Audio.prototype = {
  interval: function (interval) {
    if (interval) this._interval = interval;
    return this._interval;
  },

  rate: function (rate) {
    if (rate) this._rate = rate;
    return this._rate;
  }
};

module.exports = Audio;