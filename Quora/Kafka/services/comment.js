var db = require('../app/db');

function handle_request(msg, callback) {
    db.comment(msg, function () {
        console.log("Kafka "+msg)
        callback(null,'Successfully added a the comment.');
    }, function (err) {
        callback(err,'Unable to add comment');
    });
}

exports.handle_request = handle_request;