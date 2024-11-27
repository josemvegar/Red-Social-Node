const {Schema, model} = require("mongoose");

const UserSchema = Schema({
    name:{
        type: String,
        required: true
    },
    surname: String,
    nick:{
        type: String,
        required: true
    },
    bio: String,
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "role_user"
    },
    imagen: {
        type: String,
        default: "default.png"
    },
    crate_at: {
        type: Date,
        default: Date.now
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = model("User", UserSchema, "users");