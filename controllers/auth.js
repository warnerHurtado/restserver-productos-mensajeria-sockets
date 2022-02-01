const { response } = require("express");
const Usuario = require('../models/usuario')

const bcryptjs = require('bcryptjs');
const { generateJWT } = require("../helpers/generate-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        //Verificar que el correo exista
        const user = await Usuario.findOne( { email });
        if( !user ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        
        //Verificar que el user esté activo
        if( !user.estado ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }

        //Verifiacar la contraseña 
        const validPass = bcryptjs.compareSync( password, user.password );

        if ( !validPass ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }
       //console.log(user);
        
        //Generar el JWT
        const token = await generateJWT( user.id );


        res.json({
            user,
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Algo salió mal'
        }); 
    }

}

const googleSignIn = async(req, res=response) => {

    const { id_token } = req.body;    
    
    try {

        const { name, img, email } = await googleVerify( id_token );

        let user = await Usuario.findOne({ email });

        if( !user ){
            //creo el user 
            const data = {
                name,
                email,
                password: ':P',
                img,
                google: true
            };
            user = new Usuario( data );
            await user.save();
        }

        // Si usuario en BD
        if( !user.estado ){
            return res.status(401).json({
                msg: 'Hable con el administrador, el usuario se encuentra bloqueado'
            });
        }

        //Generar el JWT
        const token = await generateJWT( user.id );

        res.json({
            user,
            token
        });
        
    } catch (error) {
        res.status(400).json({ 
            msg: 'Error con el token de google'
        })
    }

}

const resfreshToken = async( req, res = response ) => {

    const { user } = req;

    const token = await generateJWT( user.id );

    res.json({
        user,
        token
    })
}

module.exports = {
    login,
    googleSignIn,
    resfreshToken
}