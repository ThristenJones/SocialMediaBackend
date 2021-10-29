const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 5, maxlength: 50 },
    email: {type : String, unique: true, required: true, minlength: 5, maxlength: 255 },
    password: { type: String, required: true, maxlength: 1024, minlength: 5 },
    friendList: {type: Array, default: [] },
    pendingFrendList: {type: Array, default: [] },
    // picture: {type: as a string and bring in a 3rd party api },
    isAdmin: { type: Boolean, default: false },
});

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id, name: this.name, isAdmin: this.isAdmin }, config.get('jwtSecret'));
};

const User = mongoose.model('User',  userSchema);

function validateUser(user) {
    const schema =Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(1024).required(),
    });
    return schema.validate(user);
}

function validateFriend(reply) {
    const schema = Joi.object({
        email: Joi.string().min(2).max(1000).required()
    });
    return schema.validate(reply);
}

exports.User = User;
exports.validateUser = validateUser;