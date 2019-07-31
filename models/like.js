var Sequelize = require('sequelize')

var config = require('../config'),
  db = require('../services/database');


var modelDefinition = {
  authorId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  videoId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
};


var LikeModel = db.define('like', modelDefinition);

module.exports = LikeModel;
