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

app.use(async function (ctx, next) {
  const start = new Date();
  await next(writeOnBlack());
  const ms = new Date() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});


app.listen(3000);
console.log("port 3000 was start!")

function writeOnBlack() {
  console.log("This is a bloack board.");
}