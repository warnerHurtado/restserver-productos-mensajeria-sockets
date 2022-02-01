
const { Schema, model } = require('mongoose');

const CategorieSchema = Schema({ 
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
    }
});

CategorieSchema.methods.toJSON = function(){
    //Quitando el password del modelo
    const { __v, estado, ...data } = this.toObject();
    return data;
}

module.exports = model( 'Categoria', CategorieSchema );