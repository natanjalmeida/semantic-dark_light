/*******************************
          Clean Task
*******************************/

var
  del    = require('del'),
  config = require('./config/user'),
  tasks  = require('./config/tasks')
;

// cleans distribution files
module.exports = function(callback) {
  // console.log('!'+config.paths.clean+'/index.html');
  return del([config.paths.clean], tasks.settings.del, callback);
};