var db = require('../app/db');

function handle_request(msg, callback) {
    db.getTopAnswers(msg, function (result) {
        callback(null,result);
    }, function (err) {
        callback(err,"Unable to retrieve top 10 upvoted answers")
    })
    
}

exports.handle_request = handle_request;