const UserModel = require('../models/user-model');
const nodemailer = require('nodemailer');
var crypto = require("crypto");
exports.SendRecoverEmail = async (req, res, next) => {

    //searching for the user in the database
    const email = req.body.email;
    const user = await UserModel.findOne({ email })

    if(email === ''){
        return res.status(400).json({
            success:false,
            message: 'All fields are required!',
        });
    }

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    if(!validateEmail(email)){
        return res.status(400).json({
            success:false,
            message: "Please enter a valid email adress!",
        })
    }

    if (!user) {
        return res.status(400).json({
            success:false,
            message: "There is no account linked to that email",
        })
    }

    //creating the secret
    const secret = crypto.randomBytes(6).toString('hex');

    //saving the secret on to the database
    user.resetCode = secret;
    await user.save();

    //creating a nodemailer yahoo transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_PASSWORD
        }
    });

    //creating the content of the mail
    var mailOptions = {
        to: user.email,
        from: 'resetSyndesipassword@demo.com',
        subject: 'Syndesi Password Reset',
        text: 'You are receiving this because you have requested the reset of the password for your Syndesi account.\n\n' +
            'Use the following code to reset your password:\n\n' +
            'Code: ' + secret + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    };
    //sending the mail whit the mail options to the sender
    transporter.sendMail(mailOptions, (err) => {
        if (err) {
            console.log(err)
            return res.json({
                success:false,
                message: "Something went wrong,please try again later",

            });
        } else {
            next();
        }
    });
}



