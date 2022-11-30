'use strict';

var os = require('os');

var platformToMethod = {
  darwin: 'ps',
  sunos: 'ps',
  freebsd: 'ps',
  netbsd: 'ps',
  win: 'wmic',
  linux: 'ps',
  aix: 'ps',
};

var methodToRequireFn = {
  ps: () => require('./ps'),
  wmic: () => require('./wmic'),
};

var platform = os.platform();
if (platform.startsWith('win')) {
  platform = 'win';
}

var method = platformToMethod[platform];

/**
 * Gets the list of all the pids of the system.
 * @param  {Function} callback Called when the list is ready.
 */
function get(options, callback) {
  if (method === undefined) {
    callback(
      new Error(
        os.platform() +
          ' is not supported yet, please open an issue (https://github.com/simonepri/pidtree)'
      )
    );
  }

  var systemCall = methodToRequireFn[method]();
  systemCall(options, callback);
}

module.exports = get;
