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

//add new follower user (my_email) to target user (target_email)
//to be clear: (my_email is gonna follow target_email)
//2 step update
//Step1: Add my_email to followers array of target_email
//Step2: Add target_email to following array of my_email

router.post('/', function (req, response) {
    console.log("Inside unfollow post Request");
    console.log(req.body)
    Model.profile.findOne({ email: req.body.target_email }, (err, results) => {
        if (err) {
            console.log("Unable to fetch user profile", err);
            return response.status(400).json({ success: false, already: false, message: "Unable to unfollow" });
        } else {

            if (results && !results.followers.includes(req.body.my_email)) {
                console.log("Not Following Person. Can't Unfollow");
                return response.status(200).json({ success: false, already: true, message: "already not following" });

            }
            else if(results) {
                //step1:
                //results.followers.push(req.body.my_email)
                var index = results.followers.indexOf(req.body.my_email);
                if (index > -1) {
                      results.followers.splice(index, 1);
                }
                results.save().then( 
                    doc => {
                        //step2:
                        Model.profile.update(
                            {
                                email: req.body.my_email
                            },
                            {
                                $pull: { following: req.body.target_email }
                            }
                        )
                            .then(() => {
                                return response.status(200).json({ success: true, already: false, message: "Successfull Unfollow" });
                            })
                            .catch(error => {
                                console.log(error)
                                response.status(400).json({ success: false, already: false, message: "Unable to unfollow" });
                                return;
                            });


                    },
                    err1 => {
                        console.log("Unable to save profile details!", err1);
                        return response.status(400).json({ success: false, already: false, message: "Unable to unfollow" });
                    }
                );
            } else {
                console.log("user not found in profile table");
                return response.status(400).json({ success: false, already: false, message: "Unable to unfollow" });
            }
        }//big else

    });
});

module.exports = router