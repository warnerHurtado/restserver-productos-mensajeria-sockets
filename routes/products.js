const { Router } = require('express');
const { check } = require('express-validator');
const { createProduct, getAllProducts, getProductForId, deleteProduct, updateProduct } = require('../controllers/products');
const { existIdCate, existIdProdu } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validateJWT } = require('../middlewares/validate-jwt');
const { isAdminRole } = require('../middlewares/validate-roles');

const router = Router();

router.post('/', [
    validateJWT,
    check('category', 'El id de la categoria es obligatorio').notEmpty(),
    check('category', 'No es un ID valido').isMongoId(),
    check('category').custom( existIdCate ),
    check('name', 'El nombre es obligatorio').notEmpty(),
    validarCampos
], createProduct);

router.get('/', getAllProducts);

router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existIdProdu ),
    validarCampos 
], getProductForId)

// Actualizar - privado - cualquiera con token válido
router.put('/:id', [
    validateJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existIdProdu ),
    validarCampos
], updateProduct)

router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existIdProdu ),
    validarCampos
], deleteProduct)

module.exports = router;