const mongose =require("mongoose")

const ProductSchema =new mongose.Schema({
Name:{
    type:String,
    require

},
Price:{
    type:Number,
    require
}

})
module.exports =mongose.model("Product",ProductSchema)
