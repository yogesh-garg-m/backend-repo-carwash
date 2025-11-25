const bookingmentModel = require("../models/bookingModel.js");

// Generate available time slots (9 AM to 6 PM, hourly slots)
const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
        const time12 = hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`;
        slots.push(time12);
    }
    return slots;
};

// Get available time slots for a specific date (common for all services)
const getAvailableSlots = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Date is required",
                body: []
            });
        }

        // Validate date format
        const bookingDate = new Date(date);
        if (isNaN(bookingDate.getTime())) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Invalid date format. Use YYYY-MM-DD",
                body: []
            });
        }

        // Check if date is in the past
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        bookingDate.setHours(0, 0, 0, 0);
        
        if (bookingDate < today) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Cannot book for past dates",
                body: []
            });
        }

        // Get all time slots
        const allSlots = generateTimeSlots();

        // Find booked slots for this date (common for ALL services - if any service is booked, slot is unavailable)
        // Only count accepted (1) and in-progress (3) bookings as blocking
        const startOfDay = new Date(bookingDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(bookingDate);
        endOfDay.setHours(23, 59, 59, 999);
        
        const bookedBookings = await bookingmentModel.find({
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            },
            status: { $in: [1, 3] } // Only accepted and in-progress block slots
        });

        // Extract booked time slots
        const bookedSlots = bookedBookings.map(booking => booking.timeSlot);

        // Filter out booked slots
        const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

        return res.json({
            success: true,
            status: 200,
            message: "Available slots retrieved successfully",
            body: {
                date: date,
                availableSlots: availableSlots,
                allSlots: allSlots,
                bookedSlots: bookedSlots
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            status: 500,
            message: error.message || "Error fetching available slots",
            body: []
        });
    }
};

module.exports = { getAvailableSlots, generateTimeSlots };

