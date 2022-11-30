'use strict';

var get = require('./get');

/**
 * Get the list of children and grandchildren pids of the given PID.
 * @param  {Number|String} PID A PID. If -1 will return all the pids.
 * @param  {Object} [options] Optional options object.
 * @param  {Boolean} [options.root=false] Include the provided PID in the list.
 * @param  {Boolean} [options.advanced=false] Returns a list of objects in the
 * format {pid: X, ppid: Y}.
 * @param  {Function} callback(err, list) Called when the list is ready.
 */
function list(PID, options, callback) {

  if (typeof options === 'function') {
    // console.log(options, ' is a function');
    callback = options;
    options = {};
  }

  if (typeof options !== 'object') {
    // console.log(options, ' is not an object');
    options = {};
  }

    // console.log('we have PID: ' + PID);
  const parsedPID = parseInt(PID, 10);
  if(PID === null || (typeof PID !== 'number' && typeof PID !== 'string') || parsedPID < -1) {
    // console.log(PID)
    // console.log(typeof PID);
    // console.log(parsedPID);
    callback(new TypeError('The pid provided is invalid'));
    return;
  }
  // pid is a number but is invalid
  else if (isNaN(parsedPID) ) {
    // PID is Not a number maybe it's a system name
    options.pid = -1;
    options.byName = PID;
    PID = -1;
  }
  else{
    PID = parsedPID;
    options.pid = PID;
  }

// why do we need to get everything if we can filter now
  get(options, function(err, list) {
    if (err) {
      callback(err);
      return;
    }

    // If the user wants the whole list just return it
    if (PID === -1) {
      for (var i = 0; i < list.length; i++) {
        if( options.advanced){
          list[i] = options.withNames
          ? {name : list[i][0], ppid: list[i][1], pid: list[i][2]}
          : {ppid: list[i][0], pid: list[i][1]};
        }else{
          list[i] = options.withNames ? {name: list[i][0], pid:list[i][2]} : list[i][1];
        }

      }
      callback(null, list);
      return;
    }
    // console.log('list before root: ');
    // console.log(list);
    var root;
    for (var l = 0; l < list.length; l++) {
      if(!options.withNames){
        if (list[l][1] === PID) {
          root = options.advanced ? {ppid: list[l][0], pid: PID} : PID;
          break;
        }

        if (list[l][0] === PID) {
          root = options.advanced ? {pid: PID} : PID; // Special pids like 0 on *nix
        }
      }else{
        if (list[l][2] === PID) {
          if(options.advanced){
            root =  {name:list[l][0], ppid: list[l][1], pid: list[l][2]} ;
          }
          else{
            root =  {name:list[l][0], pid: list[l][2]} ;
          }
            break;
        }
        if (list[l][1] === PID) {
          root = {name: list[l][0], pid: PID}; // Special pids like 0 on *nix
        }
      }
    }


    if (!root) {
      callback(new Error('No matching pid found'));
      return;
    }

    // Build the adiacency Hash Map (pid -> [children of pid])
    var tree = {};
    while (list.length > 0) {
      var element = list.pop();
      // console.log(element);
      if (tree[element[0]]) {
        tree[element[0]].push(element[1]);
      } else {
        tree[element[0]] = [element[1]];
      }
    }

    // Starting by the PID provided by the user, traverse the tree using the
    // adiacency Hash Map until the whole subtree is visited.
    // Each pid encountered while visiting is added to the pids array.
    var idx = 0;
    var pids = [root];
    // console.log('tree : ');
    // console.log(tree);

    while (idx < pids.length) {
      var curpid = options.advanced ? pids[idx++].pid : pids[idx++];
      if (!tree[curpid]) continue;
      var length = tree[curpid].length;
      for (var j = 0; j < length; j++) {
        pids.push(
          options.advanced
            ? {ppid: curpid, pid: tree[curpid][j]}
            : tree[curpid][j]
        );
      }
      delete tree[curpid];
    }
    // console.log(pids)

    if (!options.root && !options.withNames) {
      pids.shift(); // Remove root
    }
    // console.log(pids)

    callback(null, pids);
  });
}

module.exports = list;
