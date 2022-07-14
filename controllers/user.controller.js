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
// following user
const followingUser=async(req, res=response) => {
  const {idToFollow}=req.body;
  const {id}=req.user;
  //  validar con la base de datos
  try {

    const userFollowed = await User.findById(idToFollow);
    const myUser = await User.findById(id);

    if(userFollowed.followers.includes(id)){
      return res.status(404).json({msg:'You are already following this user'})
    }
    if(myUser.following.includes(idToFollow)){
      return res.status(404).json({msg:'This user is already following this user'})
    }
    // // push into the list of the followers
    await User.findByIdAndUpdate(idToFollow,{
      $push:{followers:id},
      isFollowing:true,
    },{
      new:true,
    });
    // a
    await User.findByIdAndUpdate(id,{
      $push:{following:idToFollow}
    },{
      new:true,
    })
    res.json({msg: "You have successfully followed this user"});
  } catch (error) {
    return res.status(500).json({msg: error.message});
  }
}
// unfollowing user
const UnfollowUser=async(req, res=response) => {
  const {idToUnFollow}=req.body;
  const {id}=req.user;
  //  validar con la base de datos
  try {

    // // push into the list of the followers
    await User.findByIdAndUpdate(idToUnFollow,{
      $pull:{followers:id},
      isFollowing:false,
    },{new:true});
    // a
    await User.findByIdAndUpdate(id,{
      $pull:{following:idToUnFollow}
    },{new:true})
    res.json({msg: "You have successfully unfollowed this user"});
  } catch (error) {
    return res.status(500).json({msg: error.message});
  }
}

// block user

const blockUser = async(req, res) => {
  const {id}=req.params;
  
  try {
    const user =await User.findByIdAndUpdate(id,{isBlocked:true},{new:true});
    res.json(user)
    
  } catch (error) {
    res.status(404).json({msg: error.message});
  }
}
// unblock user

const UnblockUser = async(req, res) => {
  const {id}=req.params;
  
  try {
    const user =await User.findByIdAndUpdate(id,{isBlocked:false},{new:true});
    res.json(user)
    
  } catch (error) {
    res.status(404).json({msg: error.message});
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
  profile,
  followingUser,
  UnfollowUser,
  blockUser,
  UnblockUser,
}