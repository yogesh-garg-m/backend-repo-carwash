const bookingmentModel = require("../models/bookingModel")
const contactUsSchema = require("../models/contactUsModel")
const userModel = require("../models/userModel")



async function countForDash(req, res) {
   try {
    const userCount=await userModel.find({role:0}).count()
    const contactUs=await contactUsSchema.find().count()
    const appointments=await bookingmentModel.find().count()
    return res.json({
        success: true,
        status: 200,
        message: "here is all user",
        body: {userCount:userCount,contactUs:contactUs,appointments:appointments,}
    })
   } catch (error) {
    console.log(error)
    return res.json({
        success: false,
        status: 400,
        message: error,
        body: {}
    })
   }
}

module.exports = countForDash