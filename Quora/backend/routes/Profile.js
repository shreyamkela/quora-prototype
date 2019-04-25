var express = require('express')
var router = express.Router();
var kafka = require('../kafka/client');

router.get('/', function (req, res) {
    console.log('in Get profile before kafka: ',req.session.user);
    kafka.make_request('profile',{email:req.session.user}, function(err,results){
    
        console.log('in Get profile Details request: ',req.session.user);
        console.log("results" + JSON.stringify(results));
    if (err)
    console.log(err);
    else{
        if(results){
            console.log("Get Details Successful");
           
            return res.status(200).send(JSON.stringify(results));
        }
        else {
            res.status(404).send({"message":"User not found"});
            console.log("get profile Failed");
        }
    }

})
})


router.post('/', function (req, res) {
    console.log("in profile update: " + req.session.user);

   var varObj= {
    email :req.session.user,
        firstname: req.body.firstname, 
        lastname: req.body.lastname, city: req.body.city,
        state: req.body.state, zipcode: req.body.zipcode,
        education: req.body.education, career: req.body.career,
        aboutme: req.body.aboutme, credentials: req.body.credentials,
    }

    kafka.make_request('update_profile',varObj, function(err,results){

    if (err)
    console.log(err);
    else{
        if(results.code == 200){
           
            console.log(results);

            res.status(200).send({"message":"Profile Updated Successfully"});
        }
        else {
        
            console.log(results);
            res.status(202).send({"message":"Update failed!"});
        } 
}
  
}
    )}
    )


module.exports = router
