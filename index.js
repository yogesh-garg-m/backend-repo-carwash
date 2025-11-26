const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
require('dotenv').config()
const connectDB = require('./config/db')
const router = require('./routes');
const contactUsRouter = require('./routes/contactUsRoutes');
const fileupload=require("express-fileupload")



const app = express()
app.use(cors({
    origin : process.env.FRONTEND_URL,
    credentials : true
}))
app.get("/", (req, res) => {
  res.status(200).send("Backend is alive");
});
const fetch = require("node-fetch");

const BACKEND_URL = "https://backend-repo-carwash.onrender.com";

setInterval(() => {
  fetch(BACKEND_URL)
    .then(() => console.log("Pinged to stay awake"))
    .catch(err => console.error("Ping failed:", err));
}, 10 * 60 * 1000); // every 5 minutes
app.use(fileupload())
app.use(express.json())
app.use(cookieParser())
app.use("/",router)
app.use("/",contactUsRouter)

//stripe
app.use(bodyParser.json());

// Route to create a payment session
// app.post('/create-payment-session', );

const PORT = 8080 || process.env.PORT


connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("connnect to DB")
        console.log("Server is running "+PORT)
    })
})
