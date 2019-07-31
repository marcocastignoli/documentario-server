const Proposal = require('../models/proposal')
const Category = require('../models/category')
const User = require('../models/user')

const ProposalController = {
  list: function(req,res) {
    if (!req.query.page) {
      res.json({ message: 'Please provide a page' });
    } else {
      const pageSize = 20
      const offset = req.query.page * pageSize
      const limit = offset + pageSize

      return Proposal.findAll({
        limit,
        offset,
        include:[
          {model: Category, required:true},
          {model: User, required:true},
        ],
      }).then(rows => {
        res.status(201).json({ data: rows });
      })
    }
  },
  my: function(req,res) {
    if (!req.query.page) {
      res.json({ message: 'Please provide a page' });
    } else {
      const pageSize = 20
      const offset = req.query.page * pageSize
      const limit = offset + pageSize

      return Proposal.findAll({
        limit,
        offset,
        include:[{model: Category, required:true}],
        where: {
          authorId: req.user.id
        }
      }).then(rows => {
        res.status(201).json({ data: rows });
      })
    }
  },
  create: function (req, res) {
    if (!req.body.link) {
      res.json({ message: 'Please provide a link' });
    } else if (!(req.body.categoryId)) {
      res.json({ message: 'Please provide a category' });
    } else {
      const newProposal = {
        authorId: req.user.id,
        categoryId: req.body.categoryId,
        link: req.body.link
      }
      return Proposal.create(newProposal).then(function () {
        res.status(201).json({ message: 'Proposal created!' });
      });
    }
  },
  delete: function (req, res) {
    if (!req.body.id) {
      res.json({ message: 'Please provide an id' });
    } else {
      let where = { id: req.body.id }
      if(req.user.role != 4) {
        where['authorId'] = req.user.id
      }
      return Proposal.destroy({
        where
      }).then(function (rowDeleted) {
        if (rowDeleted > 0) {
          res.status(201).json({ message: 'Proposal deleted!' });
        } else {
          res.json({ message: `Cannot remove a proposal that doesn't exist` });
        }
      });
    }
  }
};

module.exports = ProposalController;
