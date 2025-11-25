const mongoose = require('mongoose')

const shopCarSchema = mongoose.Schema({
    // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },

    title: { type: String, default: "" },
    price: { type: String, default: "" },
    description: { type: String, default: "" },
    image: { type: String, default: "" },

    status: { type: Number, enum: [0, 1, 2], default: 0 },
}, {
    timestamps: true
})

const shopCarModel = mongoose.model("shopCar", shopCarSchema)

module.exports = shopCarModel
