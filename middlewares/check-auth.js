const { request } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user/User");


const checkAuth=async(req=request,res,next) => {
  const token=req.headers.authorization;
  let tokenHeader;
  if(token && token.startsWith("Bearer ")) {
    try {
      tokenHeader=token.split(" ")[1];
      const decoded=jwt.verify(tokenHeader,process.env.SECRETORPUBLICKEY);
      req.user=await User.findById(decoded.id).select('-password -createdAt -updatedAt -__v');
      return next();
    } catch (error) {
        return res.status(404).json({msg: error.message});
    }
  }
  if(!token){
    return res.status(404).json({msg: 'No token is provided'});
  }
  next();
}

module.exports={checkAuth}