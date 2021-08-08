const mongoose = require("mongoose")
const { nanoid } = require("nanoid")

const LinkSchema = mongoose.Schema({
    original_link: {
        type: String,
        required: true,
    }, created_at: {
        type: Number,
        required: true,
        default: () => +new Date()
    }, active: {
        type: Boolean,
        default: true
    }, _lord: {
        type: mongoose.Types.ObjectId,
        required: true
    }, short_link: {
        type: String,
        required: true,
        default: nanoid(6),
        unique: true,
        minLength: 4
    }, redirect_count: {
        type: Number,
        default: 0
    }
})

module.exports = LinkSchema