const {parentPort, workerData} = require('worker_threads');
var pidtree = require('../');



class WatcherWorker {
  processName;
  processPid;
  parent = null;
  refresh = 1000;
  mInterval;
  state;


  constructor(data) {
    this.refresh = data.refresh;
    this.processName = data.processName;
    this.processPid = data.processPid;
    //we guess that the process is started
    this.state = {running: true};
    this.parent = parentPort;
    //setup message handling from mainProcess
    this.parent.on('message', msg => {
      console.log('message received from parent', msg);
      if(msg.stop){
        console.log('stop received from parent', msg);
        this.stop();}
    });
    //setup error handling from mainProcess
    this.parent.on('error', err => {
      console.log(err);
    });
  }


  async run(){
    this.mInterval = setInterval(async() => {
      let data = undefined;
      await pidtree(this.processPid, {withNames: true})
        .then((result) => {
          if(this.hasChanged(result)){
           data = { state: 'changed', running : this.state.running, pidtree: result};
          }
        })
        .catch(err =>{
          if(this.hasChanged([])){
            data = { state: 'changed', running : this.state.running, pidtree: err};
          }
        }
      ).finally(() => {
        if(data){
          data.time = new Date().toISOString().replace(/T/, '_');
          this.parent.postMessage(data);
        }
      });
    }, this.refresh);
  }

  hasChanged(currentState) {
    let oldState = this.state.running;
    if (Array.isArray(currentState) ){
      // process is running
      if(currentState.length > 0){
        this.state.running = true;
      }
      else{
        this.state.running = false;
      }
    }else{
      this.state.running = false;
    }
    return !(this.state.running === oldState);

  }

  stop() {
    clearInterval(this.mInterval);
    process.exit(0);
  }
}

const runner = new WatcherWorker(workerData);
runner.run();
