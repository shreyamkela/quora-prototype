var express = require("express");
var router = express.Router();
const Model = require("../database/connection");

router.post('/', function (req, response) {
  console.log("Inside fetchviews post Request");
  console.log(req.body)
  
console.log(new Date((new Date().getTime() - (parseInt(req.body.day, 10) * 24 * 60 * 60 * 1000))));
  Model.profile.aggregate([
    {$match: {email : req.body.my_email}},
    { "$project": {
      total : {
          "$filter": {
            "input": "$views",
            "as": "view",
            "cond": { "$gte" : [ "$$view", new Date((new Date().getTime() - (parseInt(req.body.day, 10) * 24 * 60 * 60 * 1000))) ]}
          }
    
      }
    }}
  ], (err, results) => {
      if (err) {
          console.log("Unable to fetch user profile", err);
          return response.status(400).json({ success: false, message: "Unable to FetchViews" });
      } else {
         console.log("Views:"+results)
          if(results.length > 0) {
             console.log("Results :"+JSON.stringify(results));
            if(results[0].total === null || results[0].total === undefined || results[0].total.length === 0 ) {
                      
                      console.log("fetchViews sending zero "+JSON.stringify(results))
                      return response.status(200).json({ success: true, count : 0 });
            } else {
              console.log("fetchViews sending some: "+JSON.stringify(results[0].total.length))
                      return response.status(200).json({ success: true, count : results[0].total.length });
                     
            }
          } else {
              console.log("user not found in profile table");
              return response.status(400).json({ success: false, message: "Unable to FetchViews" });
          }
      }//big else

  });
});

module.exports = router;
