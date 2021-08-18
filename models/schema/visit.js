const mongoose = require("mongoose")

const VisitSchema = mongoose.Schema({
    belongs_to: {
        type: mongoose.Types.ObjectId,
        required: true
    }, ip_addr: {
        type: String,
        required: true
    }, client: {
        type: String,
        required: true
    }, lang: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = VisitSchema