'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var NavigatorSchema = new Schema({
  name: String,
  description: String,
  isActive: Boolean,
  user: {
    type:  Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Navigator', NavigatorSchema);
