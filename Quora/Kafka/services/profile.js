var Profile = require("../model/profile");

function handle_request(msg, callback) {
    console.log("In handle request:" + JSON.stringify(msg));
    console.log("in get profile service")
    var email = msg.email;

    var res = {};

    if (msg.self) {
        Profile.findOne({
            email: email
        }
        ).select('firstname lastname email city state zipcode education career aboutme credentials')
            .exec()
            .then(user => {
                if (user) {
                    console.log("user found" + user);
                    res = user
                    callback(null, res);
                }
            })
            .catch(err => {
                console.log("Error case.." + err);
                res = ({ "Message": err, status: "false", code: "500" });
                callback(null, res);
            })

    } else {

        Profile.findOneAndUpdate({
            email: email
        },
            {
                $push: { views: Date.now() }
            }
        ).select('firstname lastname email city state zipcode education career aboutme credentials')
            .exec()
            .then(user => {
                if (user) {
                    console.log("user found" + user);
                    res = user
                    callback(null, res);
                }
            })
            .catch(err => {
                console.log("Error case.." + err);
                res = ({ "Message": err, status: "false", code: "500" });
                callback(null, res);
            })

    }
}

exports.handle_request = handle_request;


