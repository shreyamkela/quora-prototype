var db = require('../app/db');

function handle_request(msg, callback) {
    db.getAnswersByUserId(msg, function (result) {
        callback(null,result);
    }, function (err) {
        callback(err,"Unable to retrieve answers")
    })
    
}

exports.handle_request = handle_request;