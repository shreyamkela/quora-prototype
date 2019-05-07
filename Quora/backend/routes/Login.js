var express = require('express')
var router = express.Router();
var kafka = require('../kafka/client');

router.post('/', function (req, response) {
    kafka.make_request('user_login', req.body, function (err, msg) {
        if (err) {
            response.status(401).json({success: false,message:msg});
        } else {
            response.cookie('cookie_user', req.body.email_id, { domain: '52.14.67.136', maxAge: 900000, httpOnly: false, path: '/' });
            response.cookie('auth_token', msg.token, { domain: '52.14.67.136', httpOnly: false, path: '/' });
            req.session.user = req.body.email_id;
            response.status(200).json({success: true,message:req.body.email_id});
        }
    })
});

module.exports = router
