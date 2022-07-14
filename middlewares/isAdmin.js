const { request } = require("express");



const isAdmin=async(req=request,res,next) => {
  const {isAdmin}=req.user;

  if(!isAdmin){
    return res.status(404).json({msg: 'User not authorized to do this'});
  }
  next();
}

module.exports={isAdmin}