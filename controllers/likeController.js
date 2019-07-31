const Like = require('../models/like'),
  uniqid = require('uniqid'),
  fs = require('fs')

const LikeController = {
  create: function (req, res) {
    if (!req.body.id) {
      res.json({ message: 'Please provide a video id' });
    } else {
      const newLike = {
        authorId: req.user.id,
        videoId: req.body.id
      }
      return Like.create(newLike).then(function () {
        res.status(201).json({ message: 'Like created!' });
      }).catch(err => {
        if (err.errors && err.errors.length > 0) {
          let error = []
          err.errors.forEach(e => {
            switch (e.type) {
              case 'unique violation':
                error.push('Cannot add multiple likes')   
                break;
              default:
                error.push('Unknown error')
                break;
            }
          })
          res.status(404).json({ message: error.join(',') });
        } else {
          res.status(404).json({ message: `Video doesn't exists` });
        }
      })
    }
  },
  delete: function (req, res) {
    if (!req.body.id) {
      res.json({ message: 'Please provide an id' });
    } else {
      return Like.destroy({
        where: {
          videoId: req.body.id,
          authorId: req.user.id
        }
      }).then(function (rowDeleted) {
        if (rowDeleted > 0) {
          res.status(201).json({ message: 'Like deleted!' });
        } else {
          res.json({ message: `Cannot remove a like that doesn't exist` });
        }
      })
    }
  }
};

module.exports = LikeController;
