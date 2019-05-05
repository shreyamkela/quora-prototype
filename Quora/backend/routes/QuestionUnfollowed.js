const express = require("express");
const router = express.Router();
const Model = require("../database/connection");

router.post("/", function (req, res) {
    console.log("POST /questionUnfollowed");
    console.log("Req: ", req.body);

    Model.profile.findOne({ email: req.body.email }, (err, results) => {
        if (err) {
            console.log("Unable to fetch user profile", err);
            res.status(400).send("Unable to fetch user profile!");
        } else {
            if (results) {
                //console.log(results)
                if (results.questionsFollowed.includes(req.body.questionId) === false) {
                    res.status(200).send("Already not followed!");
                } else {

                    var index = results.questionsFollowed.indexOf(req.body.questionId);
                    if (index > -1) {
                        results.questionsFollowed.splice(index, 1);
                    }
                    results.save().then( // Save into user profile collection
                        doc => {
                            console.log("Question removed from this users followed topics");
                            // Save into topics collection
                            Model.Questions.findOne({ _id: req.body.questionId }, (err, results_questions) => {
                                if (err) {
                                    console.log("Unable to fetch Question database", err);
                                    res.status(400).send("Unable to fetch Question database!");
                                } else {
                                    if (results_questions) {
                                        results_questions.followers.pop(req.body.email)
                                        var index_1 = results_questions.followers.indexOf(req.body.email);
                                        if (index_1 > -1) {
                                            results_questions.followers.splice(index_1, 1);
                                        }
                                        results_questions.save().then(
                                            doc_1 => {
                                                console.log("User removed from this Question followers");
                                                // Only send success if both the collections have been updated
                                                res.status(200).send("Question unfollowed!");
                                            },
                                            err => {
                                                console.log("Unable to remove follower details!", err);
                                                res.status(400).send("Unable to remove follower details!");
                                            }
                                        )
                                    } else {
                                        console.log("Question not found in database!");
                                        res.status(400).send("Question not found in database!");
                                    }
                                }
                            })
                        },
                        err => {
                            console.log("Unable to remove Question details!", err);
                            res.status(400).send("Unable to remove Question details!");
                        }
                    );
                }
            } else {
                console.log("User not found in database!", err);
                res.status(400).send("User not found in database!");
            }
        }
    });

});

module.exports = router;
