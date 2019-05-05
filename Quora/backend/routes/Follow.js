var express = require('express')
var router = express.Router();
//var db = require('../../Kafka/app/db');
const Model = require("../database/connection");

//Route to upvote an  answer
/*router.post('/', function (req, response) {
    console.log("Inside follow post Request");
    console.log(req.body)
    db.addFollower({ target_email: req.body.target_email, my_email: req.body.my_email }, function () {
        return response.status(200).json({ success: true, message: "Successfully Added Follower" });
    }, function (err) {
        console.log(err)
        response.status(400).json({ success: false, message: "Unable to follow" });
    });

});*/


router.post('/', function (req, response) {
    console.log("Inside follow post Request");
    console.log(req.body)
    Model.profile.findOne({ email: req.body.target_email }, (err, results) => {
        if (err) {
            console.log("Unable to fetch user profile", err);
            return response.status(400).json({ success: false, already: false, message: "Unable to follow" });
        } else {

            if (results && results.followers.includes(req.body.my_email)) {
                console.log("Already Following");
                return response.status(200).json({ success: false, already: true, message: "already following" });

            }
            else if(results) {
                //step1:
                results.followers.push(req.body.my_email)
                results.save().then( 
                    doc => {
                        //step2:
                        Model.profile.findOneAndUpdate(
                            {
                                email: req.body.my_email
                            },
                            {
                                $push: { following: req.body.target_email }
                            }
                        )
                            .then(() => {
                                return response.status(200).json({ success: true, already: false, message: "Successfully Added Follower" });
                            })
                            .catch(error => {
                                console.log(error)
                                response.status(400).json({ success: false, already: false, message: "Unable to follow" });
                                return;
                            });


                    },
                    err1 => {
                        console.log("Unable to save profile details!", err1);
                        return response.status(400).json({ success: false, already: false, message: "Unable to follow" });
                    }
                );
            } else {
                console.log("user not found in profile table");
                return response.status(400).json({ success: false, already: false, message: "Unable to follow" });
            }
        }//big else

    });
});

module.exports = router