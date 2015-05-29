'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SailboatSchema = new Schema({
  name: String,
  info: String,
  isActive: Boolean,
  boatModel: String,
  raceDate: Date,
  _creator: {
  	type: Number,
  	required: true
  }
});

/**
 * Virtuals
 */
// Public profile information
SailboatSchema
  .virtual('profile')
  .get(function() {
    return {
      'name': this.name,
      'info': this.info,
      'isActive': this.isActive,
      'boatModel': this.boatModel,
      'raceDate': this.raceDate
    };
  });

module.exports = mongoose.model('Sailboat', SailboatSchema);