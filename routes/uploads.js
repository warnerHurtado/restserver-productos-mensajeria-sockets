const { Router } = require('express');
const { check } = require('express-validator');
const { uploadFiles, updateImage, imageShow, updateImageCloudinary } = require('../controllers/uploads');
const { allowedCollection } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { uploadFileValidate } = require('../middlewares/validate-file');

const router = Router();

router.post( '/',  uploadFileValidate , uploadFiles );

router.put( '/:collection/:id', [
    uploadFileValidate,         //Valido que venga archivos y con el nombre del parametro como file
    check('id', 'El id debe ser tipo Mongo').isMongoId(),
    check('collection').custom( c => allowedCollection( c, ['users', 'products'] )),
    validarCampos
], /*updateImage <- era dentron del mismo servidor*/ updateImageCloudinary ); //este otro es para otro servidor

router.get('/:collection/:id', [
    //uploadFileValidate,         //Valido que venga archivos y con el nombre del parametro como file
    check('id', 'El id debe ser tipo Mongo').isMongoId(),
    check('collection').custom( c => allowedCollection( c, ['users', 'products'] )),
    validarCampos
], imageShow )

module.exports = router;