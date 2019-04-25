var Profile = require("../model/profile");

function handle_request(msg, callback){
    console.log("In handle request:"+ JSON.stringify(msg));
    console.log("in update profile service")
    var res = {};
console.log("email:" + msg.email )
    Profile.findOneAndUpdate({email: msg.email},
        {
        firstname: msg.firstname, 
        lastname: msg.lastname, email: msg.email,
        city: msg.city, state: msg.state,
        zipcode: msg.zipcode, education: msg.education,
        career: msg.career, aboutme: msg.aboutme,
        credentials:msg.credentials
    })
     .exec()
         .then(messages => {
         
                console.log("Profile updated " + JSON.stringify(messages));
             res=({user: messages, status: "true", code: "200"});
                 callback(null, res);
             })
             .catch(err => {
                console.log("Error case.." + err);
                res=({"Message": err, status: "false", code: "500"});
                callback(null, res);
            })
}

exports.handle_request = handle_request;


