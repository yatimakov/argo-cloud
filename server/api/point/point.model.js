'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PointSchema = new Schema({
  _navigatorID: {
    type: String,
    ref: 'Navigator'
  },
  x: Number,
  y: Number,
  date: Date
});

module.exports = mongoose.model('Point', PointSchema);
