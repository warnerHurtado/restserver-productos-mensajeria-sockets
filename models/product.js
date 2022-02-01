const { Schema, model } = require('mongoose');

const ProductSchema = Schema({ 
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },

    precio: {
        type: Number,
        default: 0
    },

    category: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        require: true
    },

    description: { type: String },

    disponible: { type: Boolean, default: true},

    img: { type: String },
});

ProductSchema.methods.toJSON = function(){
    //Quitando el password del modelo
    const { __v, estado, ...data } = this.toObject();
    return data;
}

module.exports = model( 'Producto', ProductSchema );