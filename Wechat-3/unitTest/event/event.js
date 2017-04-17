const events = require('events'),
      EventEmitter = events.EventEmitter,
      util = require('util');

function myEmiter(){
    // EventEmitter.call(this);
};

util.inherits(myEmiter,EventEmitter);//继承EventEmitter类
const myEmitterIns = new myEmiter();

myEmitterIns.on('data',(o)=>{
    console.log('receive the data:'+o.a);
});

myEmitterIns.emit('data',{a:1});