const mongoose = require("mongoose")

const VisitSchema = mongoose.Types({
    belongs_to: {
        type: mongoose.Types.ObjectId,
        required: true
    }, ip_addr: {
        type: String,
        required: true
    }, time: {
        type: Number,
        default: () => +new Date()
    }, client: {
        type: String,
        required: true
    }
})

module.exports = VisitSchema