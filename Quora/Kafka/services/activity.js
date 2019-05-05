var db = require('../app/db');

function handle_request(msg, callback){
    console.log("In handle request for activity: "+ JSON.stringify(msg));

    db.fetchActivity(msg, function (result) {
        callback(null,result);
    }, function (err) {
        callback(err,'Unable to fetch');
    });
}

exports.handle_request = handle_request;


