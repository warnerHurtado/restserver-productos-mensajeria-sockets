const Role = require('../models/role');
const Usuario = require('../models/usuario');
const Categoria = require('../models/categorie');
const Producto = require('../models/product');
const ObjectId = require('mongodb').ObjectID;
const { Collection } = require('mongoose');


const isValidRole =  async( role='' ) => {
    const existRole = await Role.findOne({ role });
    
    if ( !existRole ){
        throw new Error(`El rol ${ role } no está registrado en la BD`);
    }
}

const existEmail = async( email='' ) => {
    const existEmail = await Usuario.findOne( {email} );

    if( existEmail ){
        throw new Error(`El correo ${ email } ya se encuenta registrado`);
    }

}

const existId = async( id ='' ) => {

    //Verificar si el correo existe
    const existId = await Usuario.findById( id );

    if( !existId ){
        throw new Error(`El ID ${ id } no se encuenta registrado`);
    }

}

const existIdCate = async( id ='' ) => {

    //Verificar si el correo existe
    const existId = await Categoria.findById( id );

    if( !existId ){
        throw new Error(`El ID ${ id } no se encuenta registrado`);
    }

}

const existIdProdu = async( id ='' ) => {
    
    //Verificar si el correo existe
    const existId = await Producto.findById(  { _id: id }  );

    if( !existId ){
        console.log('Hola mundo');
        throw new Error(`El ID ${ id } no se encuenta registrado`);
    }

}

/**Validate allowed collections */

const allowedCollection = ( collection = '', collections = [] ) => {
    const included = collections.includes( collection );
    if ( !included ) {
        throw new Error(`La colección ${ collection } no es permitida, ${ collections }`);
    }

    return true;
}

module.exports = {
    isValidRole,
    existEmail,
    existId,
    existIdCate,
    existIdProdu,
    allowedCollection
}

