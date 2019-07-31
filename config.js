var config = module.exports;
var userRoles = config.userRoles = {
  guest: 1,    // ...001
  user: 2,     // ...010
  admin: 4     // ...100
};

config.db = {
  user: 'root',
  password: 'test',
  name: 'inchiesta'
};

config.db.details = {
  host: 'localhost',
  port: '9921',
  dialect: 'mysql'
};

config.keys = {
  secret: 'comahead'
};

config.accessLevels = {
  guest: userRoles.guest | userRoles.user | userRoles.admin,    // ...111
  user: userRoles.user | userRoles.admin,                       // ...110
  admin: userRoles.admin                                        // ...100
};
