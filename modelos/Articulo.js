const { Schema, model } = require("mongoose");

// Se puede hacer esto para indicar el esquema del objeto sin ser específico:
const ArticuloSchemaSimple = Schema({
    titulo: String,
    contenido:String,
    fecha: String,
    imagen: String
});

// Se puede hacer asi para ser específico:
const ArticuloSchema = Schema({
    titulo: {
        type: String,
        required: true
    },
    contenido: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now()
    },
    imagen: {
        type: String,
        //required: true,
        default: "default.png"
    }
});

// Documentación: https://mongoosejs.com/docs/schematypes.html

module.exports = model("Articulo", ArticuloSchema, "articulos");
//  Nombre del Modelo, Variable que tiene el esquema del modelo, nombre de la colección en mongo.