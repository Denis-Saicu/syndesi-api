const bcrypt = require('bcrypt');
const UserModel = require('../models/user-model');
var crypto = require("crypto");
const nodemailer = require('nodemailer');
exports.Register = async (req, res, next) => {

    const { email, password, userName } = req.body;
    const hashConst = 10;

    if (email === '' || password === '' || userName === '') {
        return res.status(400).json({
            success: false,
            message: 'All fields are required!',
        });
    }

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    if (!validateEmail(email)) {
        return res.status(400).json({
            success: false,
            message: 'Please enter a valid email adress!',
        });
    }

    var hasNumber = /\d/;
    const hasUpperCase = (password) => {
        for (i = 0; i < password.length; i++) {
            if (password[i] === password[i].toUpperCase() && !hasNumber.test(password[i])) {
                return true;
            }
        }
        return false;
    }

    if ((password.length < 8 || hasNumber.test(password) === false) || hasUpperCase(password) === false) {
        return res.status(400).json({
            success: false,
            message: 'The password must be at least 12 character long and contain at least a number and an uppercase letter',
        });
    }

    const foundUserName = await UserModel.findOne({ userName })
    if (foundUserName) {
        return res.status(400).json({
            success: false,
            message: 'A user whit that Username already exits!',
        });
    }

    const foundUser = await UserModel.findOne({ email })
    if (foundUser) {
        return res.status(400).json({
            success: false,
            message: 'Email is already in use.',
        });
    } else {
        const activated = false;
        const passwordHash = await bcrypt.hash(password, hashConst);
        const uid = crypto.randomBytes(20).toString('hex');
        const photo = "";//posibil sa scoatem functionalitatea de poza la conturi create manual
        const activationCode = crypto.randomBytes(6).toString('hex');
        const newUser = new UserModel({ activated, userName, email, password: passwordHash, uid, photo, activationCode });
        await newUser.save();

        //send confirmation email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.SENDER_PASSWORD
            }
        });

        //creating the content of the mail
        var mailOptions = {
            to: email,
            from: 'resetSyndesipassword@demo.com',
            subject: 'Syndesi Confirmation email',
            text: 'You are receiving this because you have created an Syndesi account.\n\n' +
                'Use the following code to activate your account:\n\n' +
                'Code: ' + activationCode + '\n\n' +
                'If you did not create an account please ignore this message.\n'
        };
        //sending the mail whit the mail options to the sender
        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.log(err)
                return res.json({
                    success: false,
                    message: "Something went wrong,please try again later",

                });
            }
        });

        next();
    }
};

