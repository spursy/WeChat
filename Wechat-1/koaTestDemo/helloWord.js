// var koa = require('koa');
// var app = new koa();
// // const convert = require('koa-convert');

// // app.use(convert(function *(){
// //   this.body = 'Hello World';
// // }));

// // uses async arrow functions
// app.use(async (ctx, next) => {
//   try {
//     // await next() // next is now a function
//     ctx.body = {message: "Hello World"};
//   } catch (err) {
//     ctx.body = { message: err.message }
//     ctx.status = err.status || 500
//   }
// })

const Koa = require('koa');
const app = new Koa();
var demo = require('./demo')

app.use(async function (ctx, next) {
  const start = new Date();
  console.log('1')

  // next().then(() => {
  //   console.log('1.1')
  // }).catch((err) => {
  //   console.log('1.2')
  //   console.log(err)
  // });
  // var a = await next();
  await demo(ctx, "name").catch((err) => {
    console.log("err "  +  err)
  });
  // console.log(a)
  console.log('last')
});

// app.use(async function (ctx, next) {
//   console.log('2')
//   await next().then((resolve, reject) => {
//     console.log('2.3')
//   }).catch((err) => {
//     console.log(err)
//   });
//   return new Promise(function(resolve, reject){
//         resolve('2x')
//     });
// })


app.listen(3000);
console.log("port 3000 was start!")