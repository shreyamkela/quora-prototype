var db = require('../app/db');

function handle_request(msg, callback) {
    db.vote(msg, function () {
        callback(null,'Successfully voted a the answer.');
    }, function (err) {
        callback(err,'Unable to vote answer');
    });
}

exports.handle_request = handle_request;