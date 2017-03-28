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
       console.log("2.1");
       var name = setTimeout(getName, 5000);
       console.log("2.2")
       resolve("name")
       console.log("2.3")
   })
})

function getName() {
    return "Spursy";
}

app.listen(3000);
console.log("port 3000 was start!")