

const uploadFileValidate = ( req, res = response, next ) => {

    //Valido que venga archivos y con el nombre del parametro como file
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        return res.status(400).json({msg: 'no hay archivos para subir - validarArchivoSubir.'});
    }

    next();
}

module.exports = {
    uploadFileValidate
}