const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    activated: {
        type: Boolean
    },
    resetCode: {
        type:String
    },
    userName: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String
    },
    uid: {
        type: String
    },
    photo: {
        type: String
    },
    activationCode: {
        type:String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

}, { collection: 'users' });

module.exports = mongoose.model('UserModel', UserSchema)