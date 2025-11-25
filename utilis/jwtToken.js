const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');



const jwtTokenSign = async (id) => {
    try {
        const secretKey = process.env.TOKEN_SECRET_KEY
        const token = jwt.sign({ id: id._id }, secretKey)
        const decoded = jwt.verify(token, secretKey)
        await userModel.findByIdAndUpdate({ _id: decoded.id },
            { token: token, loginTime: decoded.iat },
            { new: true })         //in this we update so that, token and logintime should save in db

        return { token, decoded }
    } catch (error) {
        console.log(error)
    }
}

module.exports= jwtTokenSign