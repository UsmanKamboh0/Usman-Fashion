const app=require('./app')
const dotenv=require('dotenv');
const connection=require('./config/database')
const cloudinary =require('cloudinary')
process.on("uncaughtException",err=>{
    console.log(`error:${err}`
    )
    console.log("shutting down server due to uncaught Exception occur");
    process.exit(1)
})
//config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "config/config.env" });
  }
connection();

//cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,

})

const Server =app.listen(process.env.PORT,()=>{
console.log(`server is working${process.env.PORT}`);

})


//uncaught error
process.on("unhandledRejection",err=>{
    console.log(`error ${err}`)
    console.log("Shutting down due to unhandled Rejection occur");
    Server.close();
    process.exit(1);
})