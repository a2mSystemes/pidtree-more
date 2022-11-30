'use strict';

var os = require('os');
var bin = require('./bin');

/**
 * Gets the list of all the pids of the system through the ps command.
 * @param  {Function} callback(err, list)
 */
function ps(options, callback) {
  var args = ['-A', '--no-header'];
  var withNames = typeof options.withNames === 'boolean' ? options.withNames : false;


  if(typeof options === 'function'){
    callback = options;
    options = undefined;
    args.push('-o', '%p,%P');
  }
  if (options !== undefined) {
      if(typeof options.byName === 'string'){
        args.push(['-o', '%c,%p,%P', '|', 'grep', '-w', '"' + options.byName + '"']);
      }

      if(typeof options.like === 'string'){
        args.push(['-o', '%c,%p,%P', '|', 'grep', '"' + options.like + '"']);
      }
  }

  bin('ps', args, function(err, stdout, code) {
    if (err) return callback(err);
    if (code !== 0) {
      return callback(new Error('pidtree ps command exited with code ' + code));
    }

    // Example of stdout
    //
    // PPID   PID
    //    1   430
    //  430   432
    //    1   727
    //    1  7166

    try {
      stdout = stdout.split(os.EOL);

      var list = [];
      for (var i = 1; i < stdout.length; i++) {
        stdout[i] = stdout[i].trim();
        if (!stdout[i]) continue;
        stdout[i] = stdout[i].split(',');

        if (withNames) {
          list.push([
                  stdout[i][0] = stdout[i][0].trim(), // name
                  stdout[i][1] = parseInt(stdout[i][1], 10), // PPID
                  stdout[i][2] = parseInt(stdout[i][2], 10) // PID
          ]);
        }
        else{
          list.push([
          parseInt(stdout[i][0], 10), // PPID
          parseInt(stdout[i][1], 10) // PID
          ]);
        }
      }

      callback(null, list);
    } catch (error) {
      callback(error);
    }
  });
}

module.exports = ps;
