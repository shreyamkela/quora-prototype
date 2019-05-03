const express = require("express");
const router = express.Router();
const Model = require("../database/connection");

// Route to unfollow a topic for an email
router.post("/", function (req, res) {
  console.log("POST /topicsUnfollowed");
  console.log("Req: ", req.body);

  Model.profile.findOne({ email: req.body.email }, (err, results) => {
    if (err) {
      console.log("Unable to fetch user profile", err);
      res.status(400).send("Unable to fetch user profile!");
    } else {
      if (results) {
        //console.log(results)
        if (results.topicsFollowed.includes(req.body.topicId) === false) {
          res.status(200).send("Already not followed!");
        } else {
          // If the topic is not already followed, update the user profile collection topicsFollowed. Then update the topics collection followers

          var index = results.topicsFollowed.indexOf(req.body.topicId); // To remove the topicId from followed topics we spice at index. Cannot use pop as pop will remove from the end of the array
          if (index > -1) {
            results.topicsFollowed.splice(index, 1);
          }
          results.save().then( // Save into user profile collection
            doc => {
              console.log("Topic removed from this users followed topics");
              // Save into topics collection
              Model.topics.findOne({ _id: req.body.topicId }, (err, results_topics) => {
                if (err) {
                  console.log("Unable to fetch topics database", err);
                  res.status(400).send("Unable to fetch topics database!");
                } else {
                  if (results_topics) {
                    results_topics.followers.pop(req.body.email)
                    var index_1 = results_topics.followers.indexOf(req.body.email);
                    if (index_1 > -1) {
                      results_topics.followers.splice(index_1, 1);
                    }
                    results_topics.save().then(
                      doc_1 => {
                        console.log("User removed from this topics followers");
                        // Only send success if both the collections have been updated
                        res.status(200).send("Topic unfollowed!");
                      },
                      err => {
                        console.log("Unable to remove follower details!", err);
                        res.status(400).send("Unable to remove follower details!");
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
              console.log("Unable to remove topic details!", err);
              res.status(400).send("Unable to remove topic details!");
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
