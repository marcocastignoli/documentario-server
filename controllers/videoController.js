const Video = require('../models/video'),
  uniqid = require('uniqid'),
  fs = require('fs')
var sequelize = require('sequelize')
const Like = require('../models/like')

const VideoController = {
  list: function (req, res) {
    if (!req.query.page) {
      res.json({ message: 'Please provide a page' });
    } else if (!req.query.categoryId) {
      res.json({ message: 'Please provide a category' });
    } else {
      const pageSize = 20
      const offset = req.query.page * pageSize
      const limit = offset + pageSize
      const userId = parseInt(req.user.id)
      return Video.findAll({
        limit,
        offset,
        raw: true,
        attributes: Object.keys(Video.rawAttributes).concat([
          [sequelize.fn('COUNT', sequelize.col('likes.id')), 'likes'],
          [sequelize.literal(`sum(if(likes.authorId=${userId}, 1, 0))`), 'liked']
        ]),
        include: [{
          'model': Like,
          'attributes':[],
          duplicating: false
        }],
        where: {
          accepted: 1,
          categoryId: req.query.categoryId
        },
        group: ['video.id'],
      }).then(rows => {
        res.status(201).json({ data: rows });
      })
    }
  },
  create: function (req, res) {
    if (!req.body.title) {
      res.json({ message: 'Please provide a title' });
    } else if (!req.body.categoryId) {
      res.json({ message: 'Please provide a category' });
    } else if (!(req.files && req.files.video)) {
      res.json({ message: 'Please provide a video' });
    } else {
      const video = req.files.video;
      const fileName = `${uniqid()}.mp4`
      const path = `/prj/inchiesta/server/videos/${fileName}`
      video.mv(path, function (err) {
        if (err) {
          res.json({ message: 'Error saving your video' });
        } else {
          const newVideo = {
            title: req.body.title,
            authorId: req.user.id,
            description: req.body.description ? req.body.description : '',
            path: fileName,
            accepted: 1,
            categoryId: req.body.categoryId
          }
          return Video.create(newVideo).then(function () {
            res.status(201).json({ message: 'Video created!' });
          });
        }
      });
    }
  },
  delete: function (req, res) {
    if (!req.body.id) {
      res.json({ message: 'Please provide an id' });
    } else {
      let path = false
      Video.findOne({
        where: {
          id: req.body.id,
          authorId: req.user.id
        }
      }).then((video, err) => {
        if (err) {
          res.json({ message: `Cannot remove a video that doesn't exist` });
        } else {
          return Video.destroy({
            where: {
              id: req.body.id,
              authorId: req.user.id
            }
          }).then(function (rowDeleted) {
            if (rowDeleted > 0) {
              try {
                fs.unlinkSync(`/prj/inchiesta/server/videos/${video.path}`)
              } catch (err) {
                console.error(err)
              }
              res.status(201).json({ message: 'Video deleted!' });
            } else {
              res.json({ message: `Cannot remove a video that doesn't exist` });
            }
          });
        }
      })
    }
  },
  stream: function (req, res) {
    const path = `/prj/inchiesta/server/videos/${req.query.path}`
    const stat = fs.statSync(path)
    const fileSize = stat.size
    const range = req.headers.range
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0], 10)
      const end = parts[1]
        ? parseInt(parts[1], 10)
        : fileSize - 1
      const chunksize = (end - start) + 1
      const file = fs.createReadStream(path, { start, end })
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(200, head)
      fs.createReadStream(path).pipe(res)
    }
  }
};

module.exports = VideoController;
