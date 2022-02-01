const { response } = require("express");
const Product      = require("../models/product"); 

//Creación de un nuevo producto
const createProduct = async (req, res = response) => {
    const { estado, user, ...body } = req.body;

    // Valido si el producto ya existe
    const productDB = await Product.findOne({ name: body.name });

    if( productDB ){
        return res.status(400).json({
            msg: `El producto ${ productDB.name }, ya existe.`
        });
    }

    const data = {
        ...body,
        name: body.name.toUpperCase(),
        user: req.user._id,
    }
  
    //Instancia del producto
    const product = new Product( data );

    //Guardando en la base de datos
    await product.save();

    res.status(201).json( product );

}

// obtenerProductos - paginado - total - pulate -> esto es para ver la info del creador
const getAllProducts = async ( req, res = response ) => {
    const { limit = 5, from = 0 } = req.query;

    const [ total, products ] = await Promise.all([

        Product.countDocuments({ estado: true }),
        Product.find({ estado: true })
        .populate('category', 'name')
        .populate('user',     'name')
        .skip( Number( from ))
        .limit( Number( limit ))

    ]);

    res.status(200).json({
        total,
        products
    })
}

const getProductForId = async ( req, res = response ) => {
    const { id } = req.params;
    const productDB = await Product.findById( id )
    .populate('category', 'name')
    .populate('user',     'name');

    res.status(200).json(productDB);

}

const updateProduct = async ( req, res = response ) => {
    const { id } = req.params;
    const { estado, user, ...data } = req.body;

    if( data.name ){
        data.name = data.name.toUpperCase();
    }

    data.user = req.user._id;

    const product = await Product.findByIdAndUpdate( id, data, { new: true });
    res.status(200).json( product );
}

const deleteProduct = async ( req, res = response ) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.status( 200 ).json(
        product
    );
}

module.exports = {
    createProduct,
    getAllProducts,
    getProductForId,
    deleteProduct,
    updateProduct
}