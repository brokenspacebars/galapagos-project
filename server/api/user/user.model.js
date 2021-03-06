'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var authTypes = ['github', 'twitter', 'facebook', 'google'];

var UserSchema = new Schema({
  name: { type: String, trim: true },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  email: { type: String, lowercase: true },
  role: {
    type: String,
    default: 'user'
  },
  isAvailable: {
    type: Boolean,
    default: false
  },
  availablePeriod: {
    startDate: {type: Date, default: Date.now},
    endDate: {type: Date, default: Date.now}
  },
  bio: { type: String, trim: true },
  sailboats: [{ type: Schema.Types.ObjectId, ref: 'Sailboat' }],
  hashedPassword: String,
  provider: String,
  salt: String,
  facebook: {},
  twitter: {},
  google: {},
  github: {}
});

/**
 * Virtuals
 */
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      'name': this.name,
      'username': this.username,
      'role': this.role,
      'isAvailable': this.isAvailable,
      'availablePeriod': this.availablePeriod,
      'bio': this.bio
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function() {
    return {
      '_id': this._id,
      'role': this.role
    };
  });

/**
 * Validations
 */

// Validate empty email
UserSchema
  .path('email')
  .validate(function(email) {
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return email.length;
  }, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('hashedPassword')
  .validate(function(hashedPassword) {
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return hashedPassword.length;
  }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({email: value}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The specified email address is already in use.');

var validatePresenceOf = function(value) {
  return value && value.length;
};

// Generate random username
var randomUsername = function() {
  var first = [
    'daring', 'dishonest', 'criminal', 'captain', 'buccaneer',
    'brutal', 'barbaric', 'evil', 'ferocious', 'gunner', 'hostile',
    'infamous', 'jolly', 'lawless', 'legendary', 'notorious',
    'robber', 'scurvy'
  ];
  var second = [
    'ship', 'sea', 'tide', 'treasure', 'weapon', 'rat', 'loot',
    'gangplank', 'fleet', 'crook', 'loot', 'hull', 'bandanna',
    'deck', 'doubloon', 'island', 'cave', 'crew', 'corsair'
  ];

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  var nick =
    capitalizeFirstLetter(first[Math.floor(Math.random() * first.length)]) +
    capitalizeFirstLetter(second[Math.floor(Math.random() * second.length)]) +
    Math.floor(Math.random()*899 + 100).toString();

  // Debug
  console.log('Nick generated: ' + nick);
  return nick;

}

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function(next) {
    console.log('is in pre-save');
    // console.log(this);
    // console.log(next);
    // if (this.isNew) {
    //   this.username = randomUsername();
    // }

    if (!this.isNew) return next();

    if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1)
      next(new Error('Invalid password'));
    else
      next();
  });

  UserSchema
    .pre('validate', function(next) {
      console.log('is in pre-validate');
      // console.log(this);
      var uniqueUsername = false;

      // while (!(uniqueUsername)) {
        this.username = randomUsername();
        mongoose.models['User'].findOne({ username: this.username }, function(err, users) {
          console.log('Users with the generated username: ', users);
          if (!users) {
            console.log('Not users');
          } else {
            console.log('Users, true');
          }

          if (!users) {
            uniqueUsername = true;
            console.log('Generated username is unique. Going on...');
            next();
          } else {
            console.log('Generated username is not unique. Trying again...');
          }
        });
      // } // end while

      // next();
    });

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};

module.exports = mongoose.model('User', UserSchema);
