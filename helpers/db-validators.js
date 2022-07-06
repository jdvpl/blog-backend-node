const { request, response } = require('express');
const Role=require('../models/rol');
const Usuario= require('../models/user/User');



const esRoleValido= async(rol='') =>{
  const existeRole=await Role.findOne({ rol});
  if(!existeRole){
    throw new Error(`El rol ${rol} no existe en la BD`)
  }
}

const existeCorreo=async(email='')=>{
    // verificar si el correo existe
    const existsEmail=await Usuario.findOne({email});
    if (existsEmail){
      throw new Error(`The email ${email} already exists.`);
    }
}
const noExisteCorreo=async(email='')=>{
    // verificar si el correo existe
    const noExistsEmail=await Usuario.findOne({email});
    if (!noExistsEmail){
      throw new Error(`The email ${email} does not exist.`);
    }
}
const existeID=async(id='')=>{
    // verificar si el correo existe
    const existsID=await Usuario.findById(id);
    if (!existsID){
      throw new Error(`The user with id ${id} does not exist.`);
    }
    return true;
}


// validar colecciones permitidas
const coleecionesPermitidas =(coleccion='',colecciones=[])=>{
  const includes=colecciones.includes(coleccion);

  if(!includes){
    throw new Error(`La coleccion ${coleccion} no es permitida. ${colecciones}` )
  }

  return true;
}



module.exports ={
  esRoleValido,
  existeCorreo,
  existeID,
  coleecionesPermitidas,
  noExisteCorreo,
}