

const { Router } = require('express');
const { check } = require('express-validator');

const { userGet, userPut, userPost, userDelete } = require('../controllers/users');
const { isValidRole, existEmail, existId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validateJWT } = require('../middlewares/validate-jwt');
const { isAdminRole, haveRole } = require('../middlewares/validate-roles');

const router = Router();

router.get('/', userGet);

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existId ),
    check('role').custom( isValidRole ), //AQUI NO ES NECESARIO PONER EL PARAMETRO YA QUE EN LA FUNCION DE FLECHA SE VA A ENVIAR LO MISMO QUE SE RECIBE

    validarCampos
], userPut);

router.post('/',[
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio y mayor a 6 carácteres').isLength({ min:6 }),
    check('email').custom( existEmail ),
    // check('role', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE' ]),
    check('role').custom( isValidRole ), //AQUI NO ES NECESARIO PONER EL PARAMETRO YA QUE EN LA FUNCION DE FLECHA SE VA A ENVIAR LO MISMO QUE SE RECIBE
    validarCampos
], userPost );

router.delete('/:id', [ 
    validateJWT,
    //isAdminRole, ESTE ESTA VALIDADO SOLO PARA EL ADMIN
    haveRole('ADMIN_ROLE', 'VENTAS_ROLE'),  //ESTE ESTA VALIDADO PARA DARLE PERMISO A VARIOS ROLES DE BORRAR USUARIOS
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existId ),
    validarCampos
    ], userDelete);




module.exports = router;