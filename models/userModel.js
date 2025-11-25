const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    firstname: {type:String,default:""},
    lastname: String,
    email: {
        type : String,
        unique : true,
        required : true
       
    },
    password: String,
    role: {type:Number,enum:[0,1],default:0},  //0-user,1-admin
    status: {type:Number,enum:[0,1,2],default:0},  //0-pending,1-accepted,2-not accepted
    phoneNumber: {type:Number,default:0},

    token: String,
    loginTime: Number,
    isAdmin: {type:Number,default:0},  //   0-admin 1,admin    
},{
    timestamps : true
})

const userModel =  mongoose.model("user",userSchema)

module.exports = userModel