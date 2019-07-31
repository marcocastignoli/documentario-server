var Sequelize = require('sequelize'),
  bcrypt = require('bcrypt');

var config = require('../config'),
  db = require('../services/database');


var modelDefinition = {
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },

  password: {
    type: Sequelize.STRING,
    allowNull: false
  },

  username: {
    type: Sequelize.STRING,
    allowNull: false
  },

  role: {
    type: Sequelize.INTEGER,
    defaultValue: config.userRoles.user
  }
};

// 2: The model options.
var modelOptions = {
  hooks: {
    beforeValidate: hashPassword
  }
};


var UserModel = db.define('user', modelDefinition, modelOptions);
UserModel.prototype.comparePasswords = function (password, callback) {
  bcrypt.compare(password, this.password, function(error, isMatch) {
    if(error) {
      return callback(error);
    }

    return callback(null, isMatch);
  });
}

// Hashes the password for a user object.
function hashPassword(user) {
  if(user.changed('password')) {
    return bcrypt.hash(user.password, 10).then(function(password) {
      user.password = password;
    });
  }
}

module.exports = UserModel;
