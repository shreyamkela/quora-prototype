var db = require('../app/db');

function handle_request(msg, callback) {
    db.bookmark(msg, function () {
        callback(null,'Successfully bookmarked the answer.');
    }, function (err) {
        callback(err,'Unable to bookmark answer');
    });
}

exports.handle_request = handle_request;