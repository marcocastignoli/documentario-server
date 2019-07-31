var Sequelize = require('sequelize')

var config = require('../config'),
  db = require('../services/database');

var Category = require("./category")
var User = require("./user")

var modelDefinition = {
  link: {
    type: Sequelize.STRING,
    allowNull: false
  },
  authorId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
};


var ProposalModel = db.define('proposal', modelDefinition);

ProposalModel.belongsTo(Category)
ProposalModel.belongsTo(User, {foreignKey: 'authorId'})

module.exports = ProposalModel;
