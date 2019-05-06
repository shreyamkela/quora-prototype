var db = require('../app/db');
var jwt = require('jsonwebtoken');
var config = require('../../backend/config/settings');
    
// Register new users
function handle_request(msg, callback) {
        // Attempt to save the user
    db.createUser(msg, function (res) {
        const newUser = new Profile({
            //    _id: new mongoose.Types.ObjectId(),
                firstname: msg.firstname,
                lastname: msg.lastname,
                email: msg.email_id,
                photo:'https://firebasestorage.googleapis.com/v0/b/quora-c0359.appspot.com/o/images%2Fdefault_profile.png?alt=media&token=5f27f99d-60ec-48f5-86f9-3dda0931b27c'
            })
            
            console.log("mongo update")
            newUser
            .save()
            .then(result => {
                console.log("result of query" + result)
                })
            .catch(err => {
                console.log("first error" + err);
   
            callback(err,'Problem in creating profile in mongodb.');
      
            })
        var token = jwt.sign({email_id:msg.email_id}, config.secret, {
            expiresIn: 900000 // in seconds
        });
        callback(null, { msg: 'Successfully created new user.', token: token });
    }, function (err) {
        callback(err,'That User ID address already exists.');
    });
    
};

exports.handle_request = handle_request;