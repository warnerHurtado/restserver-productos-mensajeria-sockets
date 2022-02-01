const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { login, googleSignIn, resfreshToken } = require('../controllers/auth');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.post('/login', [
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login);


router.post('/google', [
    check('id_token', 'El id_token es obligatorio').not().isEmpty(),
    validarCampos
], googleSignIn);

router.get( '/', validateJWT, resfreshToken );


module.exports = router;