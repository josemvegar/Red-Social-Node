// Requerimos la libreria validator para validar los datos.
const validator = require("validator"); // Documentación: https://www.npmjs.com/package/validator

const Articulo = require("../modelos/Articulo");

const prueba = (req, res) =>{
    res.status(200).json({
        mensaje: "Soy una Acción de prueba en mi controlador de Artículos"
    });
};

const curso = (req, res) =>{
    console.log("Se ha ejecutado el endpoint Probando")
    // Asi para cuando puede ser cualquier cosa como incluso un html con comillas invertidas:
    //return res.status(200).send("Probando las rutas con Node");

    // Así para devolver un Json:
    return res.status(200).json([{
        curso: "Master en Node",
        alumno: "José Vega",
        url: "/probando"
    },
    {
        curso: "Master en Node",
        alumno: "José Vega",
        url: "/probando"
    }
    ]);
};

const crear = (req, res) => {

    // Recoger los parámetros por post a guardar
    const parametros = req.body;

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

    // Crear el objeto a guardar
    const articulo = new Articulo();

    // Asignar Valores a Objeto basado en el modelo (Manual o Automático)
    // Manual:
    //articulo.titulo = parametros.titulo;
    //articulo.contenido = parametros.contenido;

    // Automática: Esto sucede si en los datos recibidos los titulos son iguales a los del esquema.
    const articuloAutomatico = new Articulo(parametros);

    // Guardar el artículo en la base de datos
    /*articuloAutomatico.save((error, articuloGuardado) => {

        if( error || !articuloGuardado){
            return res.status(500).json({
                status: "error",
                mensaje:"No se ha guardado el artículo."
            });
        }

        return res.status(200).json({
            status: "success",
            articulo: articuloGuardado,
            mensaje: "Artículo guardado con éxito"
        });

    });*/

    articuloAutomatico.save()
    .then(articuloGuardado => {
        return res.status(200).json({
            status: "success",
            articulo: articuloGuardado,
            mensaje: "Artículo guardado con éxito",
        });
    })
    .catch(error => {
        return res.status(500).json({
            status: "error",
            mensaje: "No se ha guardado el artículo.",
        });
    });


    // Devolver Resultado
    /*return res.status(200).json({
        mensaje:"Acción de Guardar.",
        parametros: parametros
    });*/
};

module.exports = {
    prueba,
    curso,
    crear
};