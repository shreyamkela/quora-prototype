var db = require('../app/db');
var crypt = require('../app/crypt');
var jwt = require('jsonwebtoken');
var config = require('../../backend/config/settings');

// Authenticate the user
function handle_request(msg, callback) {
    console.log(msg)
    db.findUser({
        email_id: msg.email_id
    }, function (res) {
            var user = {
                email_id:res.email_id
            }
        // Check if password matches
        crypt.compareHash(msg.password, res.Password, function (isMatch) {
            if (isMatch) {
                var token = jwt.sign(user, config.secret, {
                    expiresIn: 900000 // in seconds
                });
                console.log("Token:",token)
                callback(null, { role: res.Flag, token: token})
            } else {
                callback("not match","Authentication failed. Passwords did not match.")
            }
        }, function (err) {
            callback(err,"Authentication failed. Passwords did not match.");
        });
    }, function (err) {
        console.log(err)
       callback(err,'Authentication failed. User not found.');
    });
}

exports.handle_request = handle_request;