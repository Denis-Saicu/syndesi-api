const UserModel = require('../models/user-model');

exports.Activate = async (req, res, next) => {

    const activationCode = req.body.activationCode;

    if(activationCode === ''){
        return res.status(400).json({
            success:false,
            message: 'All fields are required!',
        });
    }

    const user = await UserModel.findOne({ activationCode })
    if(!user){
        return res.status(400).json({
            success:false,
            message: "The code you just entered is not a valid one.",
        })
    }

    user.activationCode = undefined;
    user.activated = true;
    user.save();

    next()
}