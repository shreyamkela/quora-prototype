var db = require('../app/db');

function handle_request(msg, callback) {
    db.updateAnswer(msg, function () {
        callback(null,'Successfully updated a the answer.');
    }, function (err) {
        callback(err,'Unable to update answer');
    });
}

exports.handle_request = handle_request;