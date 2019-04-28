console.log("in get pic service")


var Profile = require("../model/profile");

function handle_request(msg, callback){
    console.log("In handle request:"+ JSON.stringify(msg));
  
console.log("email: " + msg.email)

    Profile.findOne({
        //     user_email: req.session.user
        email: msg.email
     })  .select('firstname email photo')
         .exec()
         .then(user => {
             if (user) {
                 console.log("user found" + user);
               //  res=({user: user,  code: "200"});
                res=user
                 callback(null, user);
                 //res.status(200).json(user)
             }
            else{
                console.log("user not found" + user);
                res=({ code: "200"});
             //  res=user
                callback(null, res);
            }
            })
             .catch(err => {
                console.log("Error case.." + err);
                res=({"Message": err, code: "500"});
                callback(null, res);
               // res.status(500).json({ error: err })
            })
        }

exports.handle_request = handle_request;
