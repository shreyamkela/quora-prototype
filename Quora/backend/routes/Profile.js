var firebase =require('firebase/app')
require('firebase/storage')
var express = require('express')
var router = express.Router();
var kafka = require('../kafka/client');
global.XMLHttpRequest = require("xhr2");
const multer = require('multer')
const uuidv1 = require('uuid/v1')

var Profile = require("../../Kafka/model/profile");


var firebaseConfig = {
    apiKey: "AIzaSyAHRjo9d8DJR8GqW8DcsxXTWlqHZU274Vw",
    authDomain: "quora-c0359.firebaseapp.com",
    databaseURL: "https://quora-c0359.firebaseio.com",
    projectId: "quora-c0359",
    storageBucket: "quora-c0359.appspot.com",
    messagingSenderId: "898197570581",
    appId: "1:898197570581:web:c7bcf7c488b14b2e"
};

firebase.initializeApp(firebaseConfig)
const storage = firebase.storage();
upload=multer()

router.get('/', function (req, res) {
    console.log('in Get profile before kafka Email: ',req.query.email_id);
    console.log('in Get profile before kafka User: ',req.cookies.cookie_user);
    var self = false;
    if(req.query.email_id === req.cookies.cookie_user) {
        self = true;
        console.log("Setting self to TRUE")
    }

    kafka.make_request('profile',{email:req.query.email_id, self: self}, function(err,results){
    
        console.log('in Get profile Details request: ',req.query.email_id);
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
    console.log("in profile update: " + req.cookies.cookie_user);

   var varObj= {
    email :req.cookies.cookie_user,
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

router.post('/pic', upload.single('photo'), async function (req, res) {
    console.log("Upload pic")
    console.log("stringify req.file : " + req.file)
    console.log("Req Body : ", JSON.stringify(req.body));
        
    console.log("Done1")
    let id = uuidv1()
    const uploadtask = storage.ref(`images/${id}`).put(req.file.buffer)
    console.log("Done2")
    
    await uploadtask.on('state_changed', (snapshot) => { },
        (error) => { console.log("Error:"+error) }, async () => {
             storage.ref('images').child(id).getDownloadURL()
                .then((url) =>
                {
                    console.log("Fullpath:",url)
                        Profile.findOneAndUpdate({email: req.cookies.cookie_user},
                            {
                                $set: {
                                    photo: url
                                }
                            })
                      .then( result => {
                          console.log("updated profile photo is: " + result)
                        res.status(200).send("User Photo successfully updated");
                      })
                      .catch(err => {
                         
                        console.log("inside error" + err);
                        res.status(500).json({ error: err })
                     })   
                })
        }
    )
    
    }
    )
    
//get profile pic
router.get('/pic',function (req, res) {
    console.log("in profile PIC get");


    kafka.make_request('profilepic',{email :req.query.email_id}, function(err,results){
    
        console.log('in pic Details request: ',req.query.email_id);
        console.log("results" + JSON.stringify(results));
    if (err)
    console.log(err);

        if(results){
            console.log("Get User Details Successful");
            res.status(200).json({photo: results.photo, firstname: results.firstname,email: results.email})
        }
        else if (results.code == 404){
            console.log("get profile Failed");
            res.status(404).send({"message":"User not found"});
        }
        else{
            console.log("Problem is displaying picture");
            res.status(500).send({"message":"Problem is displaying picture"});
        }
    

});

}
)

router.post('/delete', function (req, response) {
    console.log("in user-profile delete: " + req.cookies.cookie_user);

    kafka.make_request('delete_user', {email:req.cookies.cookie_user}, function (err, msg) {
        if (err) {
            console.log("response status: 401")
            response.status(401).json({success: false,message:msg});
        } else {
            console.log("response status: 200")
            response.status(200).json({success: true,message:msg.msg});
        }
    })
});



module.exports = router
