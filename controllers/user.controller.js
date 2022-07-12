const {response}=require('express');
const {emailRegister,emailPassword} = require('../helpers/email');
const { generateToken } = require('../helpers/generateToken');
const User= require('../models/user/User');
const bcryptjs=require('bcryptjs');
const { generarJWT } = require('../helpers/generate-jwt');

// get all user confirmed
const getAllUsers=async(req, res=response) => {

  const {limite=30, desde=0}=req.query;
  const [total,users]=await Promise.all([
    User.countDocuments(),
    User.find()
      .skip(Number(desde))
      .limit(Number(limite))
  ])
  return res.json({total,limite,desde, users});
}
// get all user confirmed
const getUserById=async(req, res=response) => {
  const {id} = req.params;
  try {
  const user=await User.findById(id)
  return res.json(user);
  } catch (error) {
    return res.status(500).json({msg: error.message});
  }
  
}

const profile=async(req, res)=>{
  console.log(req)
  const {user}=req;
  res.json(user)
}


// new user
const registerUser=async(req, res) => {
  const {firstName,lastName,email,password}=req.body;
  const user=new User({firstName,lastName,email,password})
  user.token=generateToken();
  try {
    // guardar en la base de datos
    await user.save()
    // send email to confirm user
    const emailRegisterData={
      email: email,
      name: firstName,
      token: user.token
    }
    emailRegister(emailRegisterData)
    return res.status(202).json({msg: 'Usuario creado correctamente, revisa tu correo para confirmar tu cuenta.'});
  } catch (error) {
    return res.status(500).json({msg:error.message});
  }
}
const login=async(req, res)=>{
  const {email,password}=req.body;

  try {
    // verificar si el correo existe
    const user=await User.findOne({ email}); 
    // verificar la contraseña
    const validPassword=bcryptjs.compareSync(password, user.password);

    if(!validPassword){
      return res.status(404).json({
        msg: 'Invalid Password'
      })
    }
    // generar el JWT
    const token=await generarJWT(user.id);
    return res.json({id:user.id,firstName:user.firstName,lastName:user.lastName,email:user.email,profilePhoto:user.profilePhoto,isAdmin:user.isAdmin,token})
  } catch (error) {
    return res.status(500).json({msg: `Hubo un error al loguearse ${error.message}`})
  }
}
const userDelete=async(req, res) => {
  const {id} = req.params

  // /boarrar fisicamente no recomendable
  // const usuario =await User.findByIdAndDelete(id)

  try {
    const userdeleted =await User.findByIdAndDelete(id)

  res.json(
    userdeleted
    );
  } catch (error) {
    
  }
  
}

const confirmAccount=async(req,res) => {
  const {token} = req.params;
  const usuarioConfirmado=await User.findOne({token});

  if(!usuarioConfirmado){
    return res.status(403).json({msg: `El token ${token} es invalido.`})
  }
  try {
    usuarioConfirmado.status = true;
    usuarioConfirmado.token = '';
    await usuarioConfirmado.save();
    return res.status(200).json({msg: `El usuario se ha confirmado correctamente.`});
  } catch (error) {
    return res.status(500).json({msg: error.message});
  }
}

const forgotPassword=async(req,res)=>{
  const {email}=req.body;
  const user=await User.findOne({email});
  try {
    user.token=generateToken();
    await user.save();
    const emailRegisterData={
      email: email,
      name: user.name,
      token: user.token
    }
    emailPassword(emailRegisterData)
    return res.status(200).json({msg: `Hemos enviado un correo con las instrucciones para la actualizacion`})
  } catch (error) {
    return res.status(500).json({msg: error.message});
  }
}

// updated password
const updatePassword=async(req,res)=>{
  const {id}=req.user;
  console.log(req.user)
  const {password} =req.body;

  const user=await User.findById(id);

  try {
    user.password=password;
    await user.save()
    return res.status(200).json({msg:`The user password was successfully updated.`})
  } catch (error) {
    return res.status(500).json({msg: error.message});
  }
}

// update user

const userPut=async(req, res=response) => {
  const {id}=req.user;
  const {_id,password, ...resto}=req.body;
  //  validar con la base de datos
  try {
    const user=await User.findByIdAndUpdate(id, resto,{new:true, runValidators:true});
    res.json(user);
  } catch (error) {
    return res.status(500).json({msg: error.message});
  }

  
}


module.exports ={
  getAllUsers,
  userPut,
  registerUser,
  userDelete,
  confirmAccount,
  forgotPassword,
  updatePassword,
  login,
  getUserById,
  profile
}