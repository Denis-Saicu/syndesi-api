const express = require('express');
const router = express.Router();

const { LogIn } = require('../controller/login-controller');
const { Register } = require('../controller/register-controller');
const { SendRecoverEmail } = require('../services/send-recover-email');
const { ResetPassword } = require('../services/reset-password');
const { Activate } = require('../services/activation');



//sign-up
router.route('/register').post(Register, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Account created successfully! Please check your email to activate it",
    })
});

//sign-in
router.route('/login').post(LogIn, (req, res) => {
    res.status(200).json({
        success: true,
        email: req.user.email,
        userName: req.user.userName,
        uid: req.user.uid,
        photo: req.user.photo
    })
});

//send reset email
router.route('/forgot').post(SendRecoverEmail, (req, res) => {
    res.status(200).json({
        success: true,
        message: `The request was accepted.A reset email should be sent to ${req.body.email}.Please check your email`,
    });
});

//reset
router.route('/reset').post(ResetPassword, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Your password has been reset',
    });
});

//activation
router.route('/activate').post(Activate, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Your account was activated.',
    });
});
module.exports = router;