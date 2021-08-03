const mongoose = require("mongoose")
const { nanoid } = require("nanoid")

const FileHistorySchema = mongoose.Schema({})
const FileSchema = mongoose.Schema({
    original_name: {
        type: String,
        required: true,
    }, sys_name: {
        type: String,
        required: true,
        unique: true
    }, size: {
        type: String,
        required: true
    }, created_at: {
        type: Number,
        required: true,
        default: () => +new Date()
    }, visible: {
        type: Boolean,
        default: true
    }, _lord: {
        type: mongoose.Types.ObjectId,
        required: true
    }, short_name: {
        type: String,
        required: true,
        default: nanoid(10),
        unique: true,
        minLength: 4
    }
})
module.exports = FileSchema