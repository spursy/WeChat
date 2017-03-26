setInterval(function(){console.log('5')},5000);
console.log('1');
function test(){
setInterval(function(){console.log('2')},1000);
}
test();
console.log('3');
setInterval(function(){console.log('4')},2000);
