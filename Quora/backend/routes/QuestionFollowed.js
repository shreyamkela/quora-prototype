const express = require("express");
const router = express.Router();
const Model = require("../database/connection");

router.get("/", function (req, res) {
    console.log("GET /questionsFollowed");
    console.log("Req: ", req.query);

    Model.profile.findOne({ email: req.query.email }, (err, results) => {
        if (err) {
            console.log("Unable to fetch user profile", err);
            res.status(400).send("Unable to fetch user profile!");
        } else {
            if (results) {
                //console.log(results)
                if (req.query.type === "1") { // For fetching all topics followed
                    Model.Questions.find({
                        _id: { $in: results.questionsFollowed }
                    }, (err, results_questions) => {
                        if (err) {
                            console.log("Unable to fetch questions database", err);
                            res.status(400).send("Unable to fetch questions database!");
                        } else {
                            if (results_questions[0] !== undefined) {
                                console.log("Questions followed by this user: ", results_questions);
                                res.status(200).send(results_questions);
                            } else {
                                console.log("No questions followed by this user!");
                                res.status(200).send("No questions followed by this user!");
                            }
                        }
                    });
                } else if (req.query.type === "2") { // For following a searched topic
                    if (results.questionsFollowed.includes(req.query.questionId)) {
                        res.status(200).send("Already followed!");
                    } else {
                        // If the topic is not already followed, update the user profile collection topicsFollowed. Then update the topics collection followers
                        results.questionsFollowed.push(req.query.questionId)
                        results.save().then( // Save into user profile collection
                            doc => {
                                console.log("New details added to this users followed topics");
                                // Save into topics collection
                                Model.Questions.findOne({ _id: req.query.questionId }, (err, results_questions) => {
                                    if (err) {
                                        console.log("Unable to fetch topics database", err);
                                        res.status(400).send("Unable to fetch topics database!");
                                    } else {
                                        if (results_questions) {
                                            results_questions.followers.push(req.query.email)
                                            results_questions.save().then(
                                                doc_1 => {
                                                    console.log("New details added ");
                                                    // Only send success if both the collections have been updated
                                                    res.status(200).send("Question followed!");
                                                },
                                                err => {
                                                    console.log("Unable to save follower details!", err);
                                                    res.status(400).send("Unable to save follower details!");
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
                                console.log("Unable to save Question details!", err);
                                res.status(400).send("Unable to save Question details!");
                            }
                        );
                    }
                }

            } else {
                console.log("User not found in database!", err);
                res.status(400).send("User not found in database!");
            }
        }
    });

});

module.exports = router;
