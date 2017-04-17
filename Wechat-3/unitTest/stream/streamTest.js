const fs = require('fs');

/**
 * fs read event
 */

// data event
// const rs = fs.createReadStream('../../config/wechat.txt');
// var chunkArr = [],
//     chunkLen = 0;
// rs.on('data',(chunk)=>{
//     chunkArr.push(chunk);
//     chunkLen+=chunk.length;
// });
// rs.on('end',(chunk)=>{
//     console.log(Buffer.concat(chunkArr,chunkLen).toString());
// });


// readable event
// const rs = fs.createReadStream('../../config/wechat.txt');
// var chunkArr = [],
//     chunkLen = 0;

// rs.on('readable',()=>{
//     var chunk = null;
//     //这里需要判断是否到了流的末尾
//     if((chunk = rs.read()) !== null){
//         chunkArr.push(chunk);
//         chunkLen+=chunk.length;
//     }
// });
// rs.on('end',(chunk)=>{
//     console.log(Buffer.concat(chunkArr,chunkLen).toString());
// });


// pause and resume event
// const rs = fs.createReadStream('../../config/wechat.txt');
// rs.on('data',(chunk)=>{
//     console.log(`system has received ${chunk.length}`);
//     rs.pause();
//     console.log(`system pause 1 second`);
//     setTimeout(()=>{
//         rs.resume();
//     },1000);
// });
// rs.on('end',(chunk)=>{
//     console.log(`data has received.`);
// });


/**
 * fs write stream. 
 */ 

// const ws = fs.createWriteStream('./test.txt');
// ws.write('Who am I?','utf8',()=>{process.stdout.write('this chunk is flushed.');});
// ws.end()

// drain, data event
// var path = require('path')
// function copy(src,dest){
//     src = path.resolve(src);
//     dest = path.resolve(dest);
//     const rs = fs.createReadStream(src);
//     const ws = fs.createWriteStream(dest);
//     console.log('copying...');
//     const stime = +new Date();
//     rs.on('data',(chunk)=>{
//         if(null === ws.write(chunk)){
//             rs.pause();
//         }
//     });
//     ws.on('drain',()=>{
//         rs.resume();
//     });
//     rs.on('end',()=>{
//         const etime = +new Date();
//         console.log(`end, time passes：${(etime-stime)/1000}秒`);
//         ws.end();
//     });
// }
// copy('./test.txt','./copyText.txt');


const Readable = require('stream').Readable;
const util = require('util');
const alphabetArr = 'abcdefghijklmnopqrstuvwxyz'.split();

// function AbReadable(){
//     if(!this instanceof AbReadable){
//         return new AbReadable();
//     }
//     Readable.call(this);
// }
// util.inherits(AbReadable,Readable);
// AbReadable.prototype._read = function(){
//     if(!alphabetArr.length){
//         this.push(null);
//     }else{
//         this.push(alphabetArr.shift());
//     }
// };

// const abReadable = new AbReadable();
// abReadable.pipe(process.stdout);

/*class AbReadable extends Readable{
    constructor(){
        super();
    }
    _read(){
        if(!alphabetArr.length){
            this.push(null);
        }else{
            this.push(alphabetArr.shift());
        }
    }
}
const abReadable = new AbReadable();
abReadable.pipe(process.stdout);*/

/*const abReadable = new Readable({
    read(){
        if(!alphabetArr.length){
            this.push(null);
        }else{
            this.push(alphabetArr.shift());
        }
    }
});
abReadable.pipe(process.stdout);*/

// const abReadable = Readable();
// abReadable._read = function(){
//     if (!alphabetArr.length) {
//         this.push(null);
//     } else {
//         this.push(alphabetArr.shift());
//     }
// }
// abReadable.pipe(process.stdout);

const Writable = require('stream').Writable;
// const myWritable = new Writable({
//     write(chunk,encoding,callback){
//         process.stdout.write(chunk);
//         callback();
//     }
// });
// myWritable.on('finish',()=>{
//     process.stdout.write('done');
// })
// myWritable.write('a');
// myWritable.write('b');
// myWritable.write('c');
// myWritable.end();


// class MyDuplex extends Duplex{
//     constructor(){
//         super();
//         this.source = [];
//     }
//     _read(){
//         if (!this.source.length) {
//             this.push(null);
//         } else {
//             this.push(this.source.shift());
//         }
//     }
//     _write(chunk,encoding,cb){
//         this.source.push(chunk);
//         cb();
//     }
// }

// const myDuplex = new MyDuplex();
// myDuplex.on('finish',()=>{
//     process.stdout.write('write done.')
// });
// myDuplex.on('end',()=>{
//     process.stdout.write('read done.')
// });
// myDuplex.write('\na\n');
// myDuplex.write('c\n');
// myDuplex.end('b\n');
// myDuplex.pipe(process.stdout);



const rs = Readable();
rs.push('a');
rs.push('b');
rs.push(null);
rs.on('data',(chunk)=>{console.log(chunk);});//<Buffer 61>与<Buffer 62>

const rs1 = Readable({objectMode:!0});
rs1.push('a');
rs1.push('b');
rs1.push(null);
rs1.on('data',(chunk)=>{console.log(chunk);});//a与b