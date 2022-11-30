'use strict';

var os = require('os');
var bin = require('./bin');
var util = require('util');


class pidtreeError extends Error {
  pid;
  options;
  constructor(message){
    super(message);
  }
}


/**
 * Gets the list of all the pids of the system through the wmic command.
 * @param  {Function} callback(err, list)
 */
function wmic(options, callback) {
  // console.log("options: " + util.inspect(options));
  if(typeof options === 'function') {
    callback = options;
    options = {};
  }
  var args = ['PROCESS'];
  var withNames = typeof options.withNames === 'boolean' ?
              options.withNames :
              false;
  if(options !== {}) {
    if(typeof options.byName === 'string'){
      args.push('where "name like \'' + options.byName + '\'"');
    }
    if(typeof options.like === 'string'){
      args.push('where "name like \'%' + options.like + '%\'"');
    }
  }
  args.push('get Name,ParentProcessId,ProcessId /format:csv');
  // console.log(args.join(' '));
  var InternalOptions = {windowsHide: true, windowsVerbatimArguments: true, pid : options.pid};
  bin('wmic', args, InternalOptions, function(err, stdout, code) {
    // console.log(stdout);
    // console.log('in wmic.js after split : ' + typeof stdout);
    // console.log('in wmic.js length of stdout array : ' + stdout.length );
    if (err) {
      let mError = new Error('pidtree wmic returns error : ' + err);
      // todo: implement an error object. To had following infos
      mError.options = options;
      callback(mError);
      return;
    }

    if (code !== 0) {
      callback(new Error('pidtree wmic command exited with code ' + code));
      return;
    }
    stdout = stdout.split(os.EOL);
    // Example of stdout
    //
    // node,ParentProcessId,ProcessId\r\r\n
    // test,test,0,777\r\r\n
    // test,test,777,778\r\r\n
    // test,test,0,779\r\r\n\r\r\n
    try {

      var list = [];
      // console.log('pid to search : ' + options.pid);

      for (var i = 2; i < stdout.length; i++) {
        stdout[i] = stdout[i].trim();
        if (!stdout[i]) continue;
        stdout[i] = stdout[i].split(',');
        // console.log('in loop : ' + stdout[i] + ' length: ' + stdout[i].length);
        if (!isNaN(parseInt(stdout[i][2], 10)) && !isNaN(parseInt(stdout[i][3], 10))) {
          if (withNames) {
            list.push([
                stdout[i][1].trim(),
                parseInt(stdout[i][2], 10),
                parseInt(stdout[i][3], 10)
              ]);
              // if (parseInt(stdout[i][3], 10) === options.pid)
                // console.log('found : ' + list[list.length -1 ]);
          }else{
            // console.log('found : PPID : ' + stdout[i][2] + ' PID : ' + stdout[i][3])
            list.push([
              parseInt(stdout[i][2], 10),
              parseInt(stdout[i][3], 10)
            ]);
          }
        }
      }

      callback(null, list);
    } catch (error) {
      callback(error);
    }
  });
}


function more(){

}

module.exports = wmic;
