var express = require("express");
var router = express.Router();

// Route to GET topics according to the search term
router.get("/", function(req, res) {
  console.log("GET /searchTopics");
  console.log("Req: ", req.query);
});

module.exports = router;
