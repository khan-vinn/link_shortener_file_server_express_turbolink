const mongoose = require("mongoose")
const { nanoid } = require("nanoid")

const FileHistorySchema = mongoose.Schema({})
const FileSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => mongoose.Types.ObjectId()
    },
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
    }, type: {
        type: String,
        required: true
    }, full_path: {
        type: String,
        required: true
    }, download_count: {
        type: Number,
        default: 0
    }
})
module.exports = FileSchema