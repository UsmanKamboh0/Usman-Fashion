const Errorhandler = require("../Utils/Errorhandler");
const jwt = require('jsonwebtoken');
const Users = require("../Models/UsersModel")

const catchAsyncErrors = require("./catchAsyncErrors");
exports.isAnthentication =catchAsyncErrors(async(req,res,next)=>{
    const {token}=req.cookies;
    if(!token){
        return next(new Errorhandler("Please Login to access Resource",401))
    }
const decodeData =jwt.verify(token, process.env.JWTSECERT);
req.user =await Users.findById(decodeData.id)
next();
})

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new Errorhandler(
            `Role: ${req.user.role} is not allowed to access this resouce `,
            403
          )
        );
      }
  
      next();
    };
  };