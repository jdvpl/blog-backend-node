const { response, request } = require('express');
const jwt=require('jsonwebtoken');
const Usuario= require("../models/user/User");

const validarJWT=async(req=request,res=response,next) => {

  const token=req.header('x-token');
  if (!token) {
    return res.status(400).json({ msg: 'No hay token en la peticion' });
  }

  try {
    
    const {uid}=jwt.verify(token,process.env.SECRETORPUBLICKEY);
    console.log(uid)
    req.uid=uid;
    const user=await Usuario.findById(uid);

    if (!user){
      return res.status(401).json({msg: 'No existe este usuario'});

    }
    // verificar i el uid estado es true
    if (!user.status) {
      return res.status(401).json({msg: 'Este Usuario no tiene permisos para eliminar usuario '})
    }
    req.user=user;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ msg: 'Token no valido'})
  }

}

module.exports ={validarJWT}