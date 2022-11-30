const { EventEmitter } = require('events');
var pidtree = require('../');
var run = require('../lib/bin');
const { Worker } = require('worker_threads');

let InternalOptions = {windowsHide: true, windowsVerbatimArguments: true};


class Watcher extends EventEmitter {

  processName;
  processPid;
  daemonize;
  isParent;
  children = null;
  tree;
  mError;
  mInterval;
  refresh = 1000;
  worker;
  workerStopped = false;

  constructor(options){
    super();
    if (typeof options === 'number'){
      this.processPid = options;
      options = {};
    }
    if(typeof options === 'string'){
      options = {processName: options};
    }
    if(typeof options === 'object'){
      if(options.processName && typeof options.processName === 'string'){
        this.processName = options.processName;
      }
      if(options.daemonize && typeof options.daemonize === 'boolean'){
        this.daemonize = options.daemonize;
      }
    }

  }

  async setup(){
    return new Promise(async (resolve, reject) =>{
      this.mError = "";
      let name = this.processName;
      if(!name)
        name = this.processPid;
        try{
          let ret = await pidtree(name, {withNames:true});
          // console.log(ret);
          if(ret === undefined){
            this.mError = new Error('process does not exist');
            reject(this.mError);
          }
          else{
            this.processPid = ret[0].pid;
            this.processName = ret[0].name;
            // console.log('ret');
            // console.log(ret);
            resolve( {processName: this.processName, PID: this.processPid});
        }
        }catch(err){
          this.mError = new Error('process does not exist. pidtree error. ' + err);
          reject(this.mError);
        }
      });
  }

  async watch(){
    this.setup().then((setup) =>{
      // broadcast that we are watching
      this.emit('ready', {processName: this.processName, PID: this.processPid});
      // set up the worker
      this.worker = new Worker(__dirname + '/WatcherWorker.js', {workerData : {processName: this.processName, processPid: this.processPid, refresh :this.refresh}});
      this.childStopped = false;
      this.worker.on('exit', (code) => {
        this.childStopped = true;
        console.log('child stopped : ', this.childStopped, ' with code: ', code);
      });
      this.worker.on('message', msg => {
        if(msg.state && msg.state === 'error'){
          this.emit('error', msg.pidtree);
        }
        if(msg.state && msg.state === 'changed'){
          if(msg.state.running){
            this.emit('processStopped', {msg: msg});
          }else{
            this.emit('processRunning', {msg: msg});
          }
          this.emit('changed', {msg: msg});
        }

      });

      }).catch(err => {
        this.emit('initError', err);
        });
    }

    async stop(){
      this.worker.postMessage({stop: true});
      return new Promise((resolve, reject) =>{
          setInterval(() => {
            if(this.childStopped){
              resolve();
            }
          }, 20);
      })
    }

    post(msg){
      this.worker.postMessage(msg);
    }

  }





module.exports = Watcher;
