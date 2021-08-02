const mongoose = require("mongoose")

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 4,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    _id: {
        type: mongoose.Types.ObjectId,
        default: () => mongoose.Types.ObjectId()
    }
})

module.exports = UserSchema