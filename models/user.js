const mongoose = require('mongoose')

const passportLocalMongoose  = require('passport-local-mongoose')


const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true,
        unique: true
    }
}) 

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema)