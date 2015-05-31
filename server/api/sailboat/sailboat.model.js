'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SailboatSchema = new Schema({
  name: {
  	type: String,
  	default: 'Boat name'
  },
  info: {
  	type: String,
  	default: 'Boat info'
  },
  isActive: {
  	type: Boolean,
  	default: false
  },
  boatModel: {
  	type: String,
  	default: 'Boat model'
  },
  raceDate: {
  	type: Date,
  	default: Date.now
  },
  raceName: String,
  _creator: {
  	type: Schema.Types.ObjectId,
  	ref: 'User',
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
      'raceDate': this.raceDate,
      'raceName': this.raceName,
      'creator': this.populate(_creator)
    };
  });

module.exports = mongoose.model('Sailboat', SailboatSchema);