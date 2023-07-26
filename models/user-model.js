const {Schema, model} = require("mongoose")


const userSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        default: null,
    }
}, {versionKey:  false})


const User = model("user", userSchema)
module.exports = User