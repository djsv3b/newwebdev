const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const postSchema = new mongoose.Schema({
    content: String,
    done: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    posts: [postSchema]
});

userSchema.plugin(uniqueValidator);

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
