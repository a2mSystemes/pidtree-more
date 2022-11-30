const pidtree = require('./pidtree');

function more(PID, name, options, callback){
  if (typeof name === 'function') {
    callback = name;
    options = {};
  }
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  PID = parseInt(PID, 10);
  if (isNaN(PID) || PID < -1) {
    callback(new TypeError('The pid provided is invalid'));
    return;
  }
}


module.exports = more;
