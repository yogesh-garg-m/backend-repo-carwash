const express = require('express')
const router = express.Router()
const userSignUpController = require("../controller/userSignup")
const userSignInController = require('../controller/userSignIn')
const authToken = require('../middleware/authToken')
const {userDetailsController, singleUserForAdmin, deleteUserForAdmin} = require('../controller/userDetails')
const userLogout = require('../controller/userLogout')
const allUsers = require('../controller/allUsers')
const updateUser = require('../controller/updateUser')
const countForDash = require('../controller/userCountForDashboard')
const middleware = require('../utilis/middleware')
const { getAllContactUs, singleGetContactUs, deleteSingleContactUs } = require('../controller/contactUsController')
const { bookingController, allbooking, singlebookingForAdmin, deletebookingForAdmin, allbookingForUser } = require("../controller/booking");
const bookingAcceptRejectByDoctor = require('../controller/bookingAcceptReject')
const {createShopProduct, getAllCar, getSingleCar} = require('../controller/shopCarController')
const { getAvailableSlots } = require('../controller/bookingSlots')

app.get("/", (req, res) => {
  res.status(200).send("Backend is alive");
});
import fetch from "node-fetch";

const BACKEND_URL = "https://backend-repo-carwash.onrender.com";

setInterval(() => {
  fetch(BACKEND_URL)
    .then(() => console.log("Pinged to stay awake"))
    .catch(err => console.error("Ping failed:", err));
}, 1 * 60 * 1000); // every 5 minutes

router.post("/signup",userSignUpController)
router.post("/signin",userSignInController)
router.post("/bookingController",middleware, bookingController)
router.get("/allbookingForUser",middleware, allbookingForUser)

router.get("/user-details",userDetailsController)
router.put("/bookingAcceptRejectByDoctor/:id",middleware,bookingAcceptRejectByDoctor)
router.patch("/admin/bookings/:id/status",middleware,bookingAcceptRejectByDoctor) // New RESTful route
router.get("/userLogout",userLogout)
router.post("/createShopProduct",middleware,createShopProduct)
router.get("/getAllCar",getAllCar)
router.get("/getSingleCar/:id",getSingleCar)
router.get("/bookings/available-slots",getAvailableSlots)

//admin panel 
router.get("/countForDash",middleware,countForDash)
router.get("/allUsers",middleware,allUsers)
router.get("/allbooking",middleware,allbooking)
router.get("/getAllContactUs",middleware,getAllContactUs)
router.get("/singleUserForAdmin/:id",middleware,singleUserForAdmin)
router.get("/singlebookingForAdmin/:id",middleware,singlebookingForAdmin)
router.get("/singleGetContactUs/:id",middleware, singleGetContactUs)
router.delete("/deleteUserForAdmin/:id",middleware,deleteUserForAdmin)
router.delete("/deleteSingleContactUs/:id",middleware,deleteSingleContactUs)
router.delete("/deletebookingForAdmin/:id",middleware,deletebookingForAdmin)

// router.post("/update-user",authToken,updateUser)
module.exports = router