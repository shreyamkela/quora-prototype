var db = require('../app/db');
var jwt = require('jsonwebtoken');
var config = require('../../backend/config/settings');
    
// Register new users
function handle_request(msg, callback) {
        // Attempt to save the user
    db.createUser(msg, function (res) {
        var token = jwt.sign({email_id:msg.email_id}, config.secret, {
            expiresIn: 900000 // in seconds
        });
        callback(null, { msg: 'Successfully created new user.', token: token });
    }, function (err) {
        callback(err,'That User ID address already exists.');
    });
    
};

exports.handle_request = handle_request;