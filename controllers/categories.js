const { response } = require("express");
const  Categoria  = require('../models/categorie')

// obtenerCategorias - paginado - total - pulate -> esto es para ver la info del creador
const getAllCategories = async( req, res = response) => {

    const { limit = 5, from = 0 } = req.query;

    const [ total, categories ] = await Promise.all([

        Categoria.countDocuments({estado: true}),

        Categoria.find({estado: true})
        .populate('user', 'name')
        .skip( Number( from ))
        .limit( Number(limit) )


    ]);
    res.status(200).json({
        total,
        categories
    });
}

// obtenerCategoriaPorId - populate
const getCategorieForId = async (req, res = response) =>{
    const { id } = req.params;

    const categorieDB = await Categoria.findById( id )
    .populate('user', 'name');

    res.status(200).json(categorieDB);
}

const createCategorie = async (req, res = response) => {

    //Paso a mayuscula el nombre
    const name = req.body.name.toUpperCase();

    //Valido si ya existe esa categoria
    const categorieDB = await Categoria.findOne({ name }); 

    if( categorieDB ){
        return res.status(400).json({
            msg: `La categoria ${ categorieDB.name }, ya existe.`
        });
    }

    // Generar la data a guardar

    const data = {
        name,
        user: req.user._id
    }

    //Se instancia con el modelo
    const categorie = new Categoria( data );

    //Grabando la data en DB
    await categorie.save();

    res.status(201).json(categorie);
     

}

// Actualizar categoria - solo el nombre
const updateCategorie = async (req, res = response) => {

    const { id } = req.params;
    const { estado, user, ...data } = req.body;

    data.name = data.name.toUpperCase();
    data.user = req.user._id;

    const categorie = await Categoria.findByIdAndUpdate(id, data, {new: true});

    res.status(200).json(
        categorie
    )
    
}

// borrar categoria - pasar el estado a false
const deleteCategorie = async (req, res = response) => {
    const { id } = req.params;

    const categorie = await Categoria.findByIdAndUpdate(id, {estado: false}, {new: true});

    res.status(200).json(
        categorie
    )
}

module.exports = {
    createCategorie,
    getCategorieForId,
    updateCategorie,
    getAllCategories,
    deleteCategorie
}
