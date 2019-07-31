var Sequelize = require('sequelize')

var config = require('../config'),
  db = require('../services/database');

var Like = require("./like")

var modelDefinition = {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: true
  },
  path: {
    type: Sequelize.STRING,
    allowNull: false
  },
  authorId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  categoryId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  accepted: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
};


var VideoModel = db.define('video', modelDefinition);
VideoModel.hasMany(Like)

module.exports = VideoModel;
