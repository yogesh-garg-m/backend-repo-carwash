const mongoose = require('mongoose')

const bookingSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', },
    carBookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'shopCar', },
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    country: { type: String, default: "" },
    phoneNumber: { type: Number, default: 0 },
    state: { type: String, default: "" },
    city: { type: String, default: "" },
    address: { type: String, default: "" },
    zipCode: { type: Number, default: "" },
    // New fields for enhanced booking flow
    serviceType: { type: String, default: "" }, // Exterior Wash, Interior Cleaning, Premium Detailing, Tire & Wheel Care
    vehicleType: { type: String, default: "" }, // Car / SUV / Bike
    vehicleModel: { type: String, default: "" },
    vehicleNumber: { type: String, default: "" }, // e.g., PB10-XXXX
    date: { type: Date, default: null }, // Booking date
    timeSlot: { type: String, default: "" }, // e.g., "09:00 AM", "10:00 AM"
    notes: { type: String, default: "" }, // Additional notes
    status: { type: Number, enum: [0, 1, 2, 3, 4], default: 0 },  //0-pending,1-accepted,2-rejected,3-in-progress,4-completed
}, {
    timestamps: true
})

// Create unique index to prevent double booking for same date and timeSlot (common for all services)
// Only for accepted/in-progress bookings
bookingSchema.index({ date: 1, timeSlot: 1 }, { 
    unique: true, 
    sparse: true,
    partialFilterExpression: { status: { $in: [1, 3] } } // Only enforce uniqueness for accepted/in-progress
})

const bookingmentModel = mongoose.model("booking", bookingSchema)

module.exports = bookingmentModel
