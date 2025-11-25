const mongoose = require('mongoose')

const contactUsModel = new mongoose.Schema({
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: Number, default: 0 },
    subject: { type: String, default: "" },
    message: { type: String, default: "" },
}, { timestamps: true })

const contactUsSchema = mongoose.model("contactUs", contactUsModel)

module.exports= contactUsSchema