var util = require('./util/util')
var path = require('path')
var fpath = path.join(__dirname, './config/wechat.txt')

var config = {
    weChat: {
        appID: 'wx5b71b0f7a4dac611',
        appSecret: 'e0eac8fcaca226c23d94ca379aab77aa',
        token: 'gufanyuanyingbikongjin',
        getAccessToken: function() {
            return util.readFileAsync(fpath);
        },
        saveAccessToken: function(fcontent) {
            return util.writeFileAsync(fpath, fcontent);
        }
    }
}

module.exports.config = config