var express = require('express')
var router = express.Router();
var kafka = require('../kafka/client');
const multer  = require('multer')
var Profile = require("../../Kafka/model/profile");

const file_storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("in cb file destination : ",file.originalname);
        cb(null, './profile_uploads/')
    },
    filename: function (req, file, cb) {
        console.log("in cb file Body : ",file.originalname);
      cb(null, new Date().toISOString() + file.originalname)
    }
  })

  const fileFilter = (req,file,cb) => {
      //store a file
      if(file.mimetype==='image/jpeg' || file.mimetype==='image/png' || file.mimetype==='application/pdf')
      cb(null,true)
else 
      //reject a file
      cb(null,false)
  }

  const upload = multer({ storage: file_storage ,fileFilter:fileFilter});

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

    router.post('/pic',upload.single('photo'),function (req, res) {
 
        console.log("stringify req.file : " + req.file)
       // console.log("stringify req : " + JSON.stringify(req))
        console.log("req.files : " + req.files )
        console.log("Req Body : ",JSON.stringify(req.body));
    
        var fullpath = ''
        fullpath = 'http://localhost:3001/'+ req.file.path
        console.log("fullpath: " + fullpath)
    
           Profile.findOneAndUpdate({email: req.session.user},
            {
              photo: fullpath 
      //      user_gender: req.body.user_gender,user_photo: req.file.path
        },
        { upsert: true})
        .exec()
         .then( result => {
             console.log("updated profile photo is: " + result)
           res.status(200).send("User Photo successfully updated");
         })
         .catch(err => {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                console.log("an error1" + err)
            } else if (err) {
                // An unknown error occurred when uploading.
                console.log("an error2" + err)
            }
           console.log("inside error" + err);
           res.status(500).json({ error: err })
        })
    }
    )
    
//get profile pic
router.get('/pic',function (req, res) {
    console.log("in profile PIC get");


    kafka.make_request('profilepic',{email :req.session.user}, function(err,results){
    
        console.log('in pic Details request: ',req.session.user);
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


module.exports = router
