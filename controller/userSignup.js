const userModel = require("../models/userModel")
const bcrypt = require('bcryptjs');
const jwtTokenSign = require("../utilis/jwtToken");


async function userSignUpController(req, res) {
    
    try {
        console.log(req.body,"kl")
        const validationU = await userModel.findOne({ email: req.body.email })
        if (validationU !== null) {
            return res.json({
                success: false,
                status: 400,
                message: "Email already exist",
                body: {}
            })
        } else {
           
            // if (req.files && req.files.image.name) {
            //     const image = req.files.image;
            //     if (image) req.body.image = imageUpload(image, "userImage");
            // }
            const passwordEncrypt = await bcrypt.hash(req.body.password, 10)
            const data = await userModel.create({ ...req.body, password: passwordEncrypt, })
            const tokenData = await jwtTokenSign({ _id: data._id })
            data.token = tokenData.token
            data.loginTime = tokenData.decoded.iat
            res.json({
                success: true,
                status: 200,
                message: "User created succesfully",
                body: data
            })
        }
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

module.exports = userSignUpController