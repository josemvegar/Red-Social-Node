// Requerimos el mongoose para hacer la conexión.
const mongoose = require("mongoose");

// Es asincrona por si tarda mcho o un tiempo largo, y tambien poder capturar errores.
const conexion = async () => {

    try{

        await mongoose.connect("mongodb://localhost:27017/mi_blog");

        // Parametros a pasar dentro de la conexión si da error o warning:
        // useNewUrlParcer: true
        // useUnifedTopology: true
        // useCreateIndex: true
        // Y esto se arma como un objeto, ejemplo:
        //mongoose.connect("mongodb://localhost:27017/mi_blog", {
        //  useNewUrlParcer: true,
        //  useUnifedTopology: true,
        //  useCreateIndex: true
        //});

        console.log("Conectado correctamente a la Base de Datos mi_blog")

    }
    catch(error) {
        console.log(error);
        throw new Error("No se ha podido conectar a la base de datos.");
        
    }

}

// Exportamos la función para que pueda ser utilizada desde afuera.
module.exports = {
    conexion
}
