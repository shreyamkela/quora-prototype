var db = require('../app/db');

function handle_request(msg, callback) {
    db.getQuestionByEmail(msg, function () {
        callback(null,'Success');
    }, function (err) {
        callback(err,'Unable to fetch answer');
    });
}

exports.handle_request = handle_request;