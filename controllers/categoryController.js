const Category = require('../models/category')

const CategoryController = {
  list: function(req,res) {
    return Category.findAll().then(rows => {
      res.status(201).json({ data: rows });
    })
  },
};

module.exports = CategoryController;
