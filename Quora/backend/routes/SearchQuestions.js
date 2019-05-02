var express = require("express");
var router = express.Router();

// Route to GET questions according to the search term
router.get("/", function(req, res) {
  console.log("GET /searchQuestions");
  console.log("Req: ", req.query);
  res.status(200).send("SUCCESS - Search questions");
});

module.exports = router;
