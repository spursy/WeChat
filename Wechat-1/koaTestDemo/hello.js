const Koa = require('koa');
const app = new Koa();
//Middleware 1
app.use(async function (ctx, next) {
    console.log("1.1")
    await next().then(function (data) {
        console.log(data)
    }).catch(function (err) {
        console.log(err)
    });
    console.log("1.2")

})
//Middleware 2
app.use(async function (ctx, next) {
   return new Promise (function (resolve, reject) {
       resolve("Spursyy")
   })
})

app.listen(3000);
console.log("port 3000 was start!")