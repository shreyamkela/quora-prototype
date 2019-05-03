var db = require('../app/db');

function handle_request(msg, callback) {
    db.addAnswer(msg, function () {
        callback(null,'Successfully added a the answer.');
    }, function (err) {
        callback(err,'Unable to add answer');
    });
}

exports.handle_request = handle_request;