//存储一条留言信息
Comment.prototype.save = function(callback) {
  var name = this.name,
      comment = this.comment;
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //通过用户名、时间及标题查找文档，并把一条留言对象添加到该文档的 comments 数组里
      collection.update({
        "name": name,
      }, {
        $push: {"comments": comment}
      } , function (err) {
          mongodb.close();
          if (err) {
            return callback(err);
          }
          callback(null);
      });   
    });
  });
};

var name = this.name,
    comment = this.comment;
mongoDb
    .open()
    .then(function(db){
      return db.collection("posts");
    })
    .then(function(collection){
      return collection.update({
            "name": name,
        }, {
            $push: {"comments": comment}
        });
    })
    .then(){
      mongodb.close();
    })
    .catch(function(e){
      throw new Error(e);
    })


var co = require("co");
var name = this.name,
    comment = this.comment;

co(function *(){
    let db, collection; 
    try{
        db = yield mongoDb.open();
        collection = yield db.collection("posts");
        yield collection.update({
            "name": name,
        }, {
            $push: {"comments": comment}
        });
    }catch(e){
        console.log(e);
    }
     mongodb.close();
});

var name = this.name,
    comment = this.comment;
var db, collection, result; 
try{
    db = await mongoDb.open();
    collection = await db.collection("users");
    collection.update({
            "name": name,
        }, {
            $push: {"comments": comment}
    });
}catch(e){
    console.log(e);
}
mongodb.close();