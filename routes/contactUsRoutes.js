const express = require('express')
const { createContactUs, deleteSingleContactUs, getAllContactUs, singleGetContactUs } =require ('../controller/contactUsController')
const middleware = require('../utilis/middleware')


const contactUsRouter = express.Router()

contactUsRouter.post("/createContactUs", createContactUs)
contactUsRouter.get("/getAllContactUs",middleware, getAllContactUs)
contactUsRouter.get("/singleGetContactUs/:id",middleware, singleGetContactUs)
contactUsRouter.delete("/deleteSingleContactUs/:id",middleware, deleteSingleContactUs)

module.exports= contactUsRouter