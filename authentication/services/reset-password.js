const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');

exports.ResetPassword = async (req, res, next) => {

    const newPassword = req.body.password;
    const resetCode = req.body.resetCode;
    const hashConst = 10;

    if(newPassword === ''||resetCode === ''){
        return res.status(400).json({
            success:false,
            message: 'All fields are required!',
        });
    }

    var hasNumber = /\d/;
    const hasUpperCase = (password) => {
         for(i=0; i<password.length; i++)
         {
            if (password[i] === password[i].toUpperCase() && !hasNumber.test(password[i])) {
                 return true;
            }
         }
         return false;
    }

    if((newPassword.length < 8 ||  hasNumber.test(newPassword) === false) || hasUpperCase(newPassword) === false){
        return res.status(400).json({
            success:false,
            message: 'The password must be at least 12 character long and contain at least a number and an uppercase letter',
        });
    }

    const user = await UserModel.findOne({ resetCode })
    if(!user){
        return res.status(400).json({
            success:false,
            message: "The code you just entered is not a valid one.",
        })
    }

    const passwordHash = await bcrypt.hash(newPassword, hashConst);
    user.resetCode = undefined;
    user.password = passwordHash;
    user.save();

    next()
}

