const {Router}=require('express');
const { check } = require('express-validator');
const { login, userPut, registerUser, userDelete, getAllUsers,  confirmAccount, forgotPassword, updatePasswordToken, updatePassword, getUserById, profile, followingUser, UnfollowUser } = require('../controllers/user.controller');
const { esRoleValido,existeCorreo,existeID, noExisteCorreo } = require('../helpers/db-validators');
const { checkAuth } = require('../middlewares/check-auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


const router=Router();

// get login
router.post('/login',[
  check('email',"Email is required").isEmail(),
  check('password',"Password is required").not().isEmpty(),
  check('email').custom(noExisteCorreo),
  validarCampos
],login);

// register a new user
router.post('/register', [
  check('firstName','Firstname is required').not().isEmpty(),
  check('lastName','lastName is required').not().isEmpty(),
  check('password','password is required').not().isEmpty(),
  check('password','password must be at least 6 characters').isLength({ min: 6}),
  check('email','Invalid email').isEmail(),
  check('email').custom(existeCorreo ),
  validarCampos
],registerUser);


// get all users 
router.get('/get-all',checkAuth,getAllUsers);

// /delete user
router.delete('/:id', 
  [
    checkAuth,
    check('id', "No es un id valido").isMongoId(),
    check('id').custom(existeID),
    validarCampos
  ],
userDelete);

// get user by id
router.get('/get-user/:id',
[
  checkAuth,
  check('id', "No es un id valido").isMongoId(),
  check('id').custom(existeID),
  validarCampos
],
getUserById);
// get user by token
router.get('/profile',checkAuth,profile);

// update password
router.put('/password',[
  checkAuth,
  check('id', "No es un id valido").isMongoId(),
  check('id').custom(existeID),
  validarCampos
], updatePassword);

// follow user
router.put('/follow',[
  checkAuth,
  check('idToFollow', "the id to follow is required").not().isEmpty(),
  check('idToFollow', "Invalid mongo ID").isMongoId(),
  check('idToFollow').custom(existeID),
  validarCampos
],followingUser);
// follow user
router.put('/unfollow',[
  checkAuth,
  check('idToUnFollow', "the id to unfollow is required").not().isEmpty(),
  check('idToUnFollow', "No es un id valido").isMongoId(),
  check('idToUnFollow').custom(existeID),
  validarCampos
],UnfollowUser);

// update user
router.put('/:id',
[
  checkAuth,
  check('id', "No es un id valido").isMongoId(),
  check('id').custom(existeID),
  validarCampos
],
  userPut);





module.exports =router;