const mongoose = require('mongoose')
require('dotenv').config()
const bcrypt = require('bcryptjs/dist/bcrypt')
const JWT = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: [true, 'Please provide username'],
        minlength: 3,
        maxlength: 25
    },
    email: {
        type: String,
        require: [true, 'Please provide the email'],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide vali email'],
        unique: true // this will create the new index for it so that no duplication will occur
    },
    password: {
        type: String,
        require: [true, 'Please provide password'],
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password should have 8 characters and at least one large, one small, one digit'],
        minlength: 8
    }
});

UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    if (this.username && this.email) {
        this.username = this.username.trim()
        this.email = this.email.trim()
    }
    next()
});

UserSchema.methods.createJWT = function () {
    return JWT.sign({ userId: this._id, username: this.username }, process.env.SECRET_KEY, { expiresIn: process.env.JWT_LIFETIME })
}

UserSchema.methods.getName = function () {
    return this.username;
}


UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch; // return true if match else false
}

module.exports = mongoose.model('REPL_User', UserSchema)