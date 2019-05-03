const express = require("express");
const router = express.Router();
const Model = require("../database/connection");

// Depending on the type - Route to GET all topics followed for an email OR Route to follow a topic (Route to follow a topic should ideally be POST but we have implemented in GET onl, to save from writing router.post)
router.get("/", function (req, res) {
  console.log("GET /topicsFollowed");
  console.log("Req: ", req.query);

  Model.profile.findOne({ email: req.query.email }, (err, results) => {
    if (err) {
      console.log("Unable to fetch user profile", err);
      res.status(400).send("Unable to fetch user profile!");
    } else {
      if (results) {
        //console.log(results)
        if (req.query.type === "1") { // For fetching all topics followed

        } else if (req.query.type === "2") { // For following a searched topic
          if (results.topicsFollowed.includes(req.query.topicId)) {
            res.status(200).send("Already followed!");
          } else {
            // If the topic is not already followed, update the user profile collection topicsFollowed. Then update the topics collection followers
            results.topicsFollowed.push(req.query.topicId)
            results.save().then( // Save into user profile collection
              doc => {
                console.log("New details added to this users followed topics");
                // Save into topics collection
                Model.topics.findOne({ _id: req.query.topicId }, (err, results_topics) => {
                  if (err) {
                    console.log("Unable to fetch topics database", err);
                    res.status(400).send("Unable to fetch topics database!");
                  } else {
                    if (results_topics) {
                      results_topics.followers.push(req.query.email)
                      results_topics.save().then(
                        doc_1 => {
                          console.log("New details added to this topics followers");
                          // Only send success if both the collections have been updated
                          res.status(200).send("Topic followed!");
                        },
                        err => {
                          console.log("Unable to save follower details!", err);
                          res.status(400).send("Unable to save follower details!");
                        }
                      )
                    } else {
                      console.log("Topic not found in database!");
                      res.status(400).send("Topic not found in database!");
                    }
                  }
                })
              },
              err => {
                console.log("Unable to save topic details!", err);
                res.status(400).send("Unable to save topic details!");
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
