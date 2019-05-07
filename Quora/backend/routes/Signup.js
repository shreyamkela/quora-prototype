var express = require('express')
var router = express.Router();
var kafka = require('../kafka/client');

// Register new users
router.post('/', function (req, response) {
    console.log(req.body);
    kafka.make_request('user_signup', req.body, function (err, msg) {
        if (err) {
            response.status(401).json({success: false,message:msg});
        } else {
            response.cookie('cookie_user', req.body.email_id, { maxAge: 900000, httpOnly: false, path: '/' });
            response.cookie('auth_token', msg.token, { httpOnly: false, path: '/' });
      //      req.session.user = req.body.user_id;
            response.status(200).json({success: true,message:msg.msg});
        }
    })
});

module.exports = router