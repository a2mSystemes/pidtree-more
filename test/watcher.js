import cp from 'child_process';
import path from 'path';

import test from 'ava';

import pify from 'pify';
import treek from 'tree-kill';

import pidtree, {Watcher} from '..';
import os from 'os';
import EventEmitter from 'events';
import { watch } from 'fs';


function isPromise(p) {
  if (typeof p === 'object' && typeof p.then === 'function') {
    return true;
  }
  return false;
}

function returnsPromise(f) {
  if (
    f.constructor.name === 'AsyncFunction' ||
    (typeof f === 'function' && isPromise(f()))
  ) {
    return true;
  }
  return false;
}

const scripts = {
  parent: path.join(__dirname, 'helpers', 'exec', 'parent.js'),
  child: path.join(__dirname, 'helpers', 'exec', 'child.js'),
};

var platform = os.platform();
if (platform.startsWith('win')) {
  platform = 'win';
}


test('should instantiate a watcher properly', async t =>{
  let watcher = new Watcher('firefox');
  t.true(watcher instanceof Watcher, 'Instance should be from Watcher Class with string constructor');
  t.true(watcher.processName === 'firefox', 'Should have pass firefox as argument');
  watcher = new Watcher({processName: 'firefox', daemonize: true});
  t.true(watcher instanceof Watcher, 'Instance should be from Watcher Class with object constructor');
  t.true(watcher.processName === 'firefox', 'Should have pass firefox as argument in object as constructor');
  t.true(watcher.daemonize, 'Should have pass daemonize option as argument in object as constructor');
  t.true(watcher instanceof EventEmitter, 'Should be a child class of EventEmitter');
});

// test('should throw error if process does not exist',async t =>{
//   let w = new Watcher('yyyyyyyxxxxxxx');
//   w.on('error', (err) => {
//     t.is(err.message.includes('process does not exist'), true, 'Should throw error if process does not exist')
//   });
//   w.watch();
//   await new Promise ( resolve =>{
//     setTimeout( () => {
//       resolve();
//     }, 1000);
//   });
// });


test('should watch if process exist and intantiate with PID',async t =>{
  let received = 0;
  const child = cp.spawn('cmd');
  let w = new Watcher(child.pid);
  w.on('changed', (instance) => {
    received++;
    t.log('watching received ', received, 'instance ', instance);
  });
  w.on('error', (err) => {
    t.log(err);
  });
  w.on('stopped', (msg) => {
    t.log(msg);
  });
  w.watch();
  await new Promise ( resolve =>{
    setTimeout(async () => {
      t.log('killing process');
      await pify(treek)(child.pid);
      resolve();
    }, 4000);
  });
  await new Promise(resolve => {
    setTimeout(async() =>{
      t.is(received, 1, 'should have received 1 change events');
      t.log('end of test');
      await w.stop();
      resolve();
    }, 2000);
  });
});
