const { response }        = require("express");
const { isValidObjectId } = require("mongoose");
const User                = require("../models/usuario");
const Category            = require("../models/categorie");
const Product             = require("../models/product");

const allowedCollections = [
    'users',
    'categories',
    'products',
    'roles'
];

const usersSearch = async ( term = '', res = response ) => {

    const isMongoID = isValidObjectId( term ); //Retorna TRUE   

    if ( isMongoID ) {
        const user = await User.findById( term );
        return res.status(200).json({
            results: ( user )? [ user ] : []
        });
    }   

    //Para las expreciones regulares, no importa si se lo mando en mayuscula o minuscula y
    //ademas si solo escribo a, me trae lo que tenga a
    const regex = new RegExp( term, 'i');

    const users = await User.find({
        $or: [{ name: regex /**, estado: true //Esto es pora mostrar solo los que no se han borrado*/ },
             { email: regex }
            ],
        $and: [{ estado: true }] //Esta podria ser otra opción cuando queremos que se le aplique a todos

    });

    res.status( 200 ).json({
        results: users
    })

}

const categorySearch = async ( term = '', res = response ) => {

    const isMongoID = isValidObjectId( term ); //Retorna TRUE   

    if ( isMongoID ) {
        const category = await Category.findById( term );
        return res.status(200).json({
            results: ( category )? [ category ] : []
        });
    }   

    const regex = new RegExp( term, 'i');

    const cate = await Category.find({
        $or: [{ name: regex }],
        $and: [{ estado: true }] //Esta podria ser otra opción cuando queremos que se le aplique a todos

    });

    res.status( 200 ).json({
        results: cate
    })

}

const productSearch = async ( term = '', res = response ) => {

    const isMongoID = isValidObjectId( term ); //Retorna TRUE   

    if ( isMongoID ) {
        const product = await Product.findById( term ).populate('category', 'name');
        return res.status(200).json({
            results: ( product )? [ product ] : []
        });
    }   

    //Para las expreciones regulares, no importa si se lo mando en mayuscula o minuscula y
    //ademas si solo escribo a, me trae lo que tenga a
    const regex = new RegExp( term, 'i');

    const products = await Product.find({
        $or: [{ name: regex  }, { description: regex }
            ],
        $and: [{ estado: true }, { disponible: true}] //Esta podria ser otra opción cuando queremos que se le aplique a todos

    }).populate('category', 'name');

    res.status( 200 ).json({
        results: products
    })

}

const search = async ( req, res = response ) => {

    const { collection, term} = req.params;

    if( !allowedCollections.includes( collection ) ){
        return res.status( 400 ).json({
            "msg": `Las colecciones permitidas son ${ allowedCollections }`
        });
    }

    switch (collection) {
        case 'users':
            usersSearch( term, res );
        break;

        case 'categories':
            categorySearch( term, res );
        break;

        case 'products':
            productSearch( term, res );
        break;

        case 'roles':
            
        break;
    
        default:
            res.status( 500 ).json({
                msg: 'Falta implementar esta búsqueda.'
            });
    }
}

module.exports = {
    search
}