const shopCarModel =require( "../models/shopCarModel.js")

 const createShopProduct=async(req,res)=>{
    try {
        const data=await shopCarModel.create({userId:req.user._id,...req.body})

        return res.json({
            status:200,
            success:true,
            message:"Created succefully",
            body:data
        })
    } catch (error) {
        console.log(error)
    }
}
 const getAllCar=async(req,res)=>{
    try {
        const data=await shopCarModel.find()

        return res.json({
            status:200,
            success:true,
            message:"Here is all cars",
            body:data
        })
    } catch (error) {
        console.log(error)
    }
}
 const getSingleCar=async(req,res)=>{
    try {
        const data=await shopCarModel.findById({_id:req.params.id})

        return res.json({
            status:200,
            success:true,
            message:"Here is single cars",
            body:data
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports={createShopProduct,getAllCar,getSingleCar}