const bookingmentModel = require("../models/bookingModel.js");
const userModel = require("../models/userModel.js");


const bookingController = async (req, res) => {
    try {
        const currentUser = req.user;
        console.log("currentUser", currentUser);

        const user = await userModel.findById(currentUser);
        
        // Create booking data with user information
        const bookingData = {
            ...req.body,
            userId: currentUser
        };

        // If new booking flow (has date and timeSlot), validate slot availability
        // Time slots are common for ALL services - if any service is booked, slot is unavailable
        if (bookingData.date && bookingData.timeSlot) {
            // Parse and normalize the date
            const bookingDate = new Date(bookingData.date);
            const startOfDay = new Date(bookingDate);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(bookingDate);
            endOfDay.setHours(23, 59, 59, 999);

            // Check if slot is already booked (for ANY service on this date/time)
            const existingBooking = await bookingmentModel.findOne({
                date: {
                    $gte: startOfDay,
                    $lte: endOfDay
                },
                timeSlot: bookingData.timeSlot,
                status: { $in: [1, 3] } // Accepted or In-Progress
            });

            if (existingBooking) {
                return res.status(400).json({
                    message: "This time slot is already booked. Please select another slot.",
                    error: true,
                    success: false,
                    data: null
                });
            }

            // Validate date is not in the past
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (startOfDay < today) {
                return res.status(400).json({
                    message: "Cannot book for past dates",
                    error: true,
                    success: false,
                    data: null
                });
            }

            // Update bookingData with normalized date
            bookingData.date = startOfDay;
        }

        const uploadbooking = new bookingmentModel(bookingData);
        const savebooking = await uploadbooking.save();

        res.status(201).json({
            message: "Booking information has been forwarded successfully",
            error: false,
            success: true,
            data: savebooking
        });
    } catch (error) {
        // Handle unique index violation (double booking)
        if (error.code === 11000) {
            return res.status(400).json({
                message: "This time slot is already booked. Please select another slot.",
                error: true,
                success: false,
                data: null
            });
        }
        res.status(400).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}


const allbooking = async (req, res) => {
    try {

        const allbooking = await bookingmentModel.find().populate("userId").populate("carBookingId");

        res.json({
            message: "All User ",
            data: allbooking,
            success: true,
            error: false
        })
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        })
    }
}
const allbookingForUser = async (req, res) => {
    try {

        const allbooking = await bookingmentModel.find({userId:req.user._id}).populate("userId").populate("carBookingId");

        res.json({
            message: "All User ",
            data: allbooking,
            success: true,
            error: false
        })
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        })
    }
}

async function singlebookingForAdmin(req,res){
    try{
        const user = await bookingmentModel.findById({_id:req.params.id}).populate("userId").populate("carBookingId")

        res.status(200).json({
            data : user,
            error : false,
            success : true,
            message : "booking details"
        })

        console.log("user",user)

    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}
async function deletebookingForAdmin(req,res){
    try{
        const user = await bookingmentModel.deleteOne({_id:req.params.id})

        res.status(200).json({
            data : {},
            error : false,
            success : true,
            message : "User details"
        })

        console.log("user",user)

    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}
module.exports = { bookingController, allbooking,singlebookingForAdmin ,deletebookingForAdmin,allbookingForUser}