var db = require('../app/db');

function handle_request(msg, callback) {
    db.getBookmarks(msg, function (result) {
        callback(null,result);
    }, function (err) {
        callback(err,"Unable to retrieve bookmarks")
    })
    
}

exports.handle_request = handle_request;