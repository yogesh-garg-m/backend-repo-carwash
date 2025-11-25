const bookingmentModel = require("../models/bookingModel")
const userModel = require("../models/userModel")

async function bookingAcceptRejectByDoctor(req, res) {
   try {
    const bookingId = req.params.id;
    const newStatus = req.body.status;
    
    // Find the booking first
    const existingBooking = await bookingmentModel.findById(bookingId);
    
    if (!existingBooking) {
        return res.json({
            success: false,
            status: 404,
            message: "Booking not found",
            body: {}
        });
    }

    // If accepting a booking (status 1), check if slot is already taken (for ANY service)
    if (newStatus == 1 && existingBooking.date && existingBooking.timeSlot) {
        const startOfDay = new Date(existingBooking.date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(existingBooking.date);
        endOfDay.setHours(23, 59, 59, 999);
        
        const conflictingBooking = await bookingmentModel.findOne({
            _id: { $ne: bookingId }, // Exclude current booking
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            },
            timeSlot: existingBooking.timeSlot,
            status: { $in: [1, 3] } // Accepted or In-Progress
        });

        if (conflictingBooking) {
            return res.json({
                success: false,
                status: 400,
                message: "Cannot accept booking. This time slot is already booked by another customer.",
                body: {}
            });
        }
    }

    // Update booking status
    const statusUpdate = await bookingmentModel.findByIdAndUpdate(
        bookingId,
        { status: newStatus },
        { new: true }
    ).populate("userId").populate("carBookingId");
   
    return res.json({
        success: true,
        status: 200,
        message: "Status updated successfully",
        body: statusUpdate
    })
   } catch (error) {
    console.log("error", error)
    return res.json({
        success: false,
        status: 400,
        message: error.message || error,
        body: {}
    })
   }
}

module.exports = bookingAcceptRejectByDoctor