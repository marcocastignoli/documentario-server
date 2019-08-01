var router = require('express').Router();
var config = require('../config');
var allowOnly = require('../services/routesHelper').allowOnly;

router.use(function (req, res, next) {
  console.log(req.originalUrl);
  next();
});

function authenticate(passport) {
  return function () {
    var result = passport.authenticate('jwt', { session: false }).apply(this, arguments);
    return result;
  };
}

var APIRoutes = function (passport) {

  router.post('/signup', require('../controllers/authController').signUp);
  router.post('/signin', require('../controllers/authController').authenticateUser);

  // GET Routes.
  router.get('/profile',
    authenticate(passport),
    allowOnly(config.accessLevels.user, require('../controllers/userController').index)
  );
  router.get('/admin',
    authenticate(passport),
    allowOnly(config.accessLevels.admin, require('../controllers/adminController').index)
  );

  // Category
  router.get('/category', require('../controllers/categoryController').list);

  // Video
  router.post('/video',
    authenticate(passport),
    allowOnly(config.accessLevels.admin, require('../controllers/videoController').create)
  );
  router.delete('/video',
    authenticate(passport),
    allowOnly(config.accessLevels.admin, require('../controllers/videoController').delete)
  );
  router.get('/video',
    authenticate(passport),
    allowOnly(config.accessLevels.user, require('../controllers/videoController').list)
  );
  router.get('/stream', require('../controllers/videoController').stream);

  // Proposal
  router.post('/proposal',
    authenticate(passport),
    allowOnly(config.accessLevels.user, require('../controllers/proposalController').create)
  );
  router.delete('/proposal',
    authenticate(passport),
    allowOnly(config.accessLevels.user, require('../controllers/proposalController').delete)
  );
  router.get('/proposal',
    authenticate(passport),
    allowOnly(config.accessLevels.admin, require('../controllers/proposalController').list)
  );
  router.get('/myproposals',
    authenticate(passport),
    allowOnly(config.accessLevels.user, require('../controllers/proposalController').my)
  );

  // Like
  router.post('/like',
    authenticate(passport),
    allowOnly(config.accessLevels.user, require('../controllers/likeController').create)
  );
  router.delete('/like',
    authenticate(passport),
    allowOnly(config.accessLevels.user, require('../controllers/likeController').delete)
  );

  return router;
};

module.exports = APIRoutes;
