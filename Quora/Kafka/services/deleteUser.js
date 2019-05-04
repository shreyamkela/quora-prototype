var db = require('../app/db');

function handle_request(msg, callback) {
console.log(JSON.stringify(msg))
db.deleteUser({
    email_id: msg.email
}, function (res) {
    Profile.deleteMany(
        {email: msg.email}
   )
        .then(result => {
            console.log("result of query" + JSON.stringify(result))
            })
        .catch(err => {
            console.log("first error" + err);

        callback(err,'Problem in deleting profile in mongodb.');
  
        })
            callback(null, { msg: 'Successfully deleted user in sqldb.' });
        }, function (err) {
            callback(err,'Problem in deleting user in sqldb.');
        });
}


exports.handle_request = handle_request;