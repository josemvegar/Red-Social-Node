// Requerimos la libreria validator para validar los datos.
const validator = require("validator"); // Documentación: https://www.npmjs.com/package/validator

const validar = (res, parametros) => {
    // Validar los datos
    // Dentro de un try-catch porque esta librería es suceptible a errores.
    try{

        let validarTitulo= !validator.isEmpty(parametros.titulo) &&
                            validator.isLength(parametros.titulo, {min: 5, max: 25});

        /*let validarTitulo= !validator.isEmpty(parametros.titulo) &&
                            validator.isLength(parametros.titulo, {min: 5, max: udefined});*/

        let validarContenido= !validator.isEmpty(parametros.contenido);

        if (!validarTitulo || !validarContenido){
            throw new Error("No se ha validado la Información.");
            
        }

    }catch{
        return res.status(400).json({
            status: "error",
            mensaje:"Faltan datos por enviar."
        });
    };
};

module.exports = {
    validar
}