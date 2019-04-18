var express = require('express')
var router = express.Router();
var kafka = require('../kafka/client');

router.post('/', function (req, response) {
    kafka.make_request('login_user', req.body, function (err, msg) {
        if (err) {
            response.status(401).json({success: false,message:msg});
        } else {
            response.cookie('cookie_user', req.body.user_id, { maxAge: 900000, httpOnly: false, path: '/' });
            response.cookie('cookie_role', msg.role, { maxAge: 900000, httpOnly: false, path: '/' });
            response.cookie('auth_token', msg.token, { httpOnly: false, path: '/' });
            req.session.user = req.body.user_id;
            response.status(200).json({success: true,message:"Login Success"});
        }
    })
});

module.exports = router