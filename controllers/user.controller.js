const {response}=require('express');
const {emailRegister,emailPassword} = require('../helpers/email');
const { generateToken } = require('../helpers/generateToken');
const User= require('../models/user/User');
const bcryptjs=require('bcryptjs');
const { generarJWT } = require('../helpers/generate-jwt');

// get all user confirmed
const getUsersConfirmed=async(req, res=response) => {

  const active={active:true}
  const {limite=5, desde=0}=req.query;
  const [total,users]=await Promise.all([
    User.countDocuments(active),
    User.find(active)
      .skip(Number(desde))
      .limit(Number(limite))
  ])
  return res.json({total,limite,desde, users});
}
// /get all users not confirmed
const usersNoConfirmed=async(req, res=response) => {
  const active={active :false}
  const {limite=5, desde=0}=req.query;
  const [total,usuarios]=await Promise.all([
    User.countDocuments(active),
    User.find(active)
      .skip(Number(desde))
      .limit(Number(limite))
  ])
  return res.json({total,limite,desde,usuarios});
}
// update user

const userPut=async(req, res=response) => {
  const id=req.params.id;
  const {_id,password,email, ...resto}=req.body;
  //  validar con la base de datos
  if(password){
    const salt=bcrypt.genSaltSync();
    resto.password=bcrypt.hashSync(password,salt);
  }
  const usuario=await User.findByIdAndUpdate(id, resto)
  res.json(
    usuario
    );
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
    const user=await User.findOne({ email}).select('-token -role -createdAt -updatedAt');
  
    // verificar si el usaurio esta activo
    // if(!user.active){
    //   return res.status(400).json({msg: 'Este usuario aun no esta activo'})
    // }
 
    // verificar la contraseña
    const validPassword=bcryptjs.compareSync(password, user.password);

    if(!validPassword){
      return res.status(400).json({
        msg: 'Invalid Password'
      })
    }
    // generar el JWT
    const token=await generarJWT(user.id);
    return res.json({user,token})
  } catch (error) {
    return res.status(500).json({msg: `Hubo un error al loguearse ${error.message}`})
  }
}
const userDelete=async(req, res) => {
  const {id} = req.params

  // /boarrar fisicamente no recomendable
  // const usuario =await User.findByIdAndDelete(id)
  const usuario =await User.findByIdAndUpdate(id,{ status:false})

  res.json(
    usuario
    );
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


const updatePasswordToken=async(req,res)=>{
  const {token}=req.params;
  const tokenvalido=await User.findOne({token});
  if(!tokenvalido){
    return res.status(404).json({msg: `El token ${token} no es valido.`})
  }
  try {
    return res.status(202).json({msg: `Usuario valido`})
  } catch (error) {
    return res.status(500).json({msg: error.message});
  }
  
}


const updatePassword=async(req,res)=>{
  const {token}=req.params;
  const {password} =req.body;

  const usuario=await User.findOne({token});
  if(!usuario){
    return res.status(403).json({msg: `El token ${token} no es valido.`})
  }

  try {
    usuario.password=password;
    usuario.token='';
    await usuario.save()
    return res.status(200).json({msg:`Haz actualizado el password correctamente`})
  } catch (error) {
    return res.status(500).json({msg: error.message});
  }


}


module.exports ={
  getUsersConfirmed,
  usersNoConfirmed,
  userPut,
  registerUser,
  userDelete,
  confirmAccount,
  forgotPassword,
  updatePasswordToken,
  updatePassword,
  login
}