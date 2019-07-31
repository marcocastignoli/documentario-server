var Sequelize = require('sequelize')

var config = require('../config'),
    db = require('../services/database');

var modelDefinition = {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
};

var CategoryModel = db.define('category', modelDefinition);

module.exports = CategoryModel;