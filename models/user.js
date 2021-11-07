const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');

const friendSchema = new mongoose.Schema({
    name: {type: String, unique: true, required: true, minlength: 5, maxlength: 1000},
    timeStamp: {type: Date, default: Date.now()},
});

const pendingFriendSchema = new mongoose.Schema({
    name: {type: String, unique: true, required: true, minlength: 5, maxlength: 1000},
    timeStamp: {type: Date, default: Date.now()},
});

const postSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 5, maxlength: 50 },
    text: {type: String, required: true, minlength: 1, maxlength: 1000},
    likes: {type: Number, default: 0},
    timeStamp: {type: Date, default: Date.now()},
});

const bioSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 5, maxlength: 50 },
    text: {type: String, required: true, minlength: 1, maxlength: 1000},
    timeStamp: {type: Date, default: Date.now()},
})

const userSchema = new mongoose.Schema({
    name: {type: String, unique: true, required: true, minlength: 5, maxlength: 50 },
    email: {type : String, unique: true, required: true, minlength: 5, maxlength: 255 },
    password: { type: String, required: true, maxlength: 1024, minlength: 5 },
    friendList: [{type: friendSchema}],
    pendingFriendList: [{type: pendingFriendSchema}],
    posts: [{type: postSchema}],
    bio: [{type: bioSchema}],
    // picture: {type: as a string and bring in a 3rd party api },
    isAdmin: { type: Boolean, default: false },
});



userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id, name: this.name, isAdmin: this.isAdmin }, config.get('jwtSecret'));
};

const User = mongoose.model('User',  userSchema);
const Friend = mongoose.model('Friend',  friendSchema);
const PendingFriend = mongoose.model('PendingFriend',  pendingFriendSchema);
const Post = mongoose.model('Post', postSchema);
const Bio = mongoose.model('Bio', bioSchema);

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
        name: Joi.string().min(1).max(1000).required()
    });
    return schema.validate(reply);
}

function validatePost(post) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        text: Joi.string().min(1).max(1000).required(),
    });
    return schema.validate(post);
}

function validateBio(bio) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        text: Joi.string().min(1).max(1000).required(),
    });
    return schema.validate(bio);
}


exports.User = User;
exports.Friend = Friend;
exports.PendingFriend = PendingFriend;
exports.Post = Post;
exports.Bio = Bio;
exports.validateUser = validateUser;
exports.validateFriend = validateFriend;
exports.validatePost = validatePost;
exports.validateBio = validateBio;

