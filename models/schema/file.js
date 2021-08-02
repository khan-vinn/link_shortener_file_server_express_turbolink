const mongoose = require("mongoose")

const FileSchema = mongoose.Schema({
    original_name: {
        type: String,
        required: true,
        unique: true
    }, sys_name: {
        type: String,
        required: true,
    }, size: {
        type: String,
        required: true
    }, created_at: {
        type: Number,
        required: true
    }, visible: {
        type: Boolean,
        default: true
    }, _id: {
        type: mongoose.Types.ObjectId,
        default: () => mongoose.Types.ObjectId()
    }, _lord: {
        type: mongoose.Types.ObjectId,
        required: true
    }
})
const FileHistorySchema = mongoose.Schema({
})
module.exports = FileSchema