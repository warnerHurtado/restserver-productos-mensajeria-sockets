const { Router } = require('express');
const { check } = require('express-validator');
const { createCategorie, getCategorieForId, updateCategorie, getAllCategories, deleteCategorie } = require('../controllers/categories');
const { existIdCate } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validateJWT } = require('../middlewares/validate-jwt');
const { isAdminRole } = require('../middlewares/validate-roles');

const router = Router();


/**
 * {{url}}/api/categorias
 */
//Obtener una categoría por id - publico
router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existIdCate ),
    validarCampos 
], getCategorieForId );

//Obtener todas las categorias - publico  
router.get('/', getAllCategories);


//Crear categoria - privado - cualquier persona con token válido
router.post('/', [ 
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos ],
     createCategorie );

// Actualizar - privado - cualquiera con token válido
router.put('/:id', [
    validateJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existIdCate ),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos 
], updateCategorie );

// Eliminar categoria - admin
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existIdCate ),
    validarCampos 
], deleteCategorie
);

module.exports = router;