const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validateJWT = async( req=request, res=response, next ) => {

    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg: 'No hay token en la petición'
        }); 
    }

    try {
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY ); 

        const user = await Usuario.findById( uid );

        // Verificar que exista el usuario
        if( !user ){
            return res.status(401).json({
                msg: 'Token no válido - no existe un usuario con ese id'
            })
        }
        

        // Verificar que ese usuario no haya sido marcado como eliminado
        if( !user.estado ){
            return res.status(401).json({
                msg: 'Token no válido - estado en false'
            })
        }
        
        req.user = user;

        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        });
        
    }
    
}

module.exports = {
    validateJWT
}