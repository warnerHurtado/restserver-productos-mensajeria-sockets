const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const userGet = async(req=request, res=response) => {
    //const query = req.query;

    const { limit = 5, from = 0 } = req.query;
    // const users = await Usuario.find({estado: true})
    // .skip( Number( from ))
    // .limit( Number(limit) );

    // const total = await Usuario.countDocuments({estado: true});

    const [ total, users ] = await Promise.all([

        Usuario.countDocuments({estado: true}),

        Usuario.find({estado: true})
        .skip( Number( from ))
        .limit( Number(limit) )


    ])
    res.json({
        total,
        users
    });
}

const userPut = async(req, res=response) => {
    const { id } = req.params;
    const { _id, password, google, correo, ...rest } = req.body;

    //TODO: validar contra base de datos
    if( password ) {
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync( password, salt );
    }

    const user = await Usuario.findByIdAndUpdate(id, rest);

    res.json(
        user
    )
    }

const userPost = async(req= request, res=response) => {

    //Aquí vienen los parámetros
    const {name, email, password, rol } = req.body;

    const user = new Usuario({name, email, password, rol});

    //Verificar si el correo ya existe


    //Encriptar la contrasenna 
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync( password, salt );

    //Guardar en BD
    user.save();

    res.json({
        msg: 'post API contro',
    })
    }

const userDelete = async(req, res=response) => {
    const { id } = req.params;

    //Lo borramos fisicamente
    //const user = await Usuario.findByIdAndDelete( id );
    const user = await Usuario.findByIdAndUpdate(id, { estado: false });

    const autenticatedUser = req.user;

    res.json({
        user, 
        autenticatedUser
    })
    }


module.exports = {
    userGet, 
    userPut,
    userPost,
    userDelete
}