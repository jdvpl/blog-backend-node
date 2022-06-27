const {Router}=require('express');
const { check } = require('express-validator');
const {  userPut, registerUser, userDelete, getUsersConfirmed, usersNoConfirmed, confirmAccount, forgotPassword, updatePasswordToken, updatePassword } = require('../controllers/user.controller');
const { esRoleValido,existeCorreo,existeID, noExisteCorreo } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


const router=Router();


router.get('/auth',getUsersConfirmed);
router.get('/noauth',usersNoConfirmed);
router.get('/confirm/:token',confirmAccount);

router.get('/forget-password/:token',updatePasswordToken);

router.post('/forget-password/:token',

[
  check('password','La contraseña debe tener minimo 6 caracteres').isLength({ min: 6}),
  validarCampos
]

,updatePassword);


router.post('/forgotpassword',
[
  check('email','Correo no valido').isEmail(),
  check('email').custom(noExisteCorreo),
  validarCampos
]
  ,forgotPassword);

router.put('/:id',
  [
    check('id', "No es un id valido").isMongoId(),
    check('id').custom(existeID),
    check('role').custom(esRoleValido ),

    validarCampos,
  ],
userPut);
router.post('/', [
  check('name','El nombre es obligatorio').not().isEmpty(),
  check('password','La contraseña debe tener minimo 6 caracteres').isLength({ min: 6}),
  check('email','Correo no valido').isEmail(),
  check('email').custom(existeCorreo ),
  validarCampos
],registerUser);

router.delete('/:id', 
  [
    validarJWT,
    check('id', "No es un id valido").isMongoId(),
    check('id').custom(existeID),
    validarCampos
  ],
userDelete);


module.exports =router;