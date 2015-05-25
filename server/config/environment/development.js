'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/galapagos-dev'
  },

  // Disable seeding in dev mode
  seedDB: false
};
