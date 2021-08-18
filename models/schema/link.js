const mongoose = require("mongoose")
const { nanoid } = require("nanoid")

const LinkSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => mongoose.Types.ObjectId()
    },
    original_link: {
        type: String,
        required: true,
    }, active: {
        type: Boolean,
        default: true
    }, _lord: {
        type: mongoose.Types.ObjectId,
        required: true
    }, short_link: {
        type: String,
        required: true,
        default: () => nanoid(6),
        unique: true,
        minLength: 4
    }, redirect_count: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

module.exports = LinkSchema