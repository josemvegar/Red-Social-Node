const {validar} = require("../helpers/validar");
const Articulo = require("../modelos/Articulo");

// Requerimos FileSystem, la cual es una libreria de node para manejar archivos.
const fs = require("fs");
// La libreria path permite tomar un archivo y enviarlo
const path = require("path");

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

    // Validar Datos
    validar(res, parametros);

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

const listar = (req, res) => {
    // El find es usado para buscar en tal modelo
    let consulta= Articulo.find({})
    .sort({fecha: -1}); // Ordenamos del agregado más recientemente al más antiguo.
    
    // Muestra de como se puede separar en partes la consulta.
    if (req.params.ultimos) {
        consulta= consulta.limit(3); // El límite de cuantos va a mostrar.
    }

    consulta.exec()
    .then(articulos => {
        if (!articulos || articulos.length === 0) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se han encontrado artículos."
            });
        }

        return res.status(200).json({
            status: "success",
            parametros_url: req.params.ultimos, // Para que tome este parámetro debería de llegar adiconal en la url "/valor del parametro"
            contador: articulos.length,
            resultados: articulos
        });
    })
    .catch( error => {
        return res.status(500).json({
            status: "error",
            mensaje: "Hubo un error al mostrar los artículos."
        });
    });
};

const unArticulo = (req, res) => {
    // Recoger id por url
    let id = req.params.id;

    // Buscar el articulo
    Articulo.findById(id).then(articulo => {
        // Si no existe, devolver error
        if (!articulo){
            return res.status(404).json({
                status: "error",
                mensaje: "No se han encontrado el artículo." + id
            });
        }

        // Si existe, devolver resultado     
        return res.status(200).json({
            status: "success",
            resultado: articulo
        });
    })
    .catch(error => {
        return res.status(404).json({
            status: "error",
            mensaje: "No se han encontrado el artículo."
        });
    });
};

/*const borrar = (req, res) => {

    let id = req.params.id;

    Articulo.findOneAndDelete({_id: id}).then(articulo => {
        res.status(200).json({
            status: "success",
            articulo: articulo,
            mensaje: "Articulo borrado"
        });
    })
    .catch(error => {
        res.status(404).json({
            status: "error",
            mensaje: "Articulo no encontrado"
        });
    });

};*/

const borrar = async (req, res) => {
    try {
        const id = req.params.id;

        const articulo = await Articulo.findOneAndDelete({ _id: id });

        if (!articulo) {
            return res.status(404).json({
                status: "error",
                mensaje: "Articulo no encontrado"
            });
        }

        res.status(200).json({
            status: "success",
            articulo: articulo,
            mensaje: "Articulo borrado"
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            mensaje: "Hubo un error al intentar borrar el articulo"
        });
    }
};

const actualizar = async (req, res) => {
    try{
        // Recoger el id a editar
        let id = req.params.id;

        // Recoger datos del body
        let parametros = req.body;

        // Buscar y validar datos
        validar(res, parametros);

        // Actualizar datos
        //const articuloActualizado = await Articulo.findOneAndUpdate({_id: id}, req.body);
        // Con ese "new: true" mostramos el objeto ya actualizado en la respuesta, ya que si no, muestra el anterior.
        const articuloActualizado = await Articulo.findOneAndUpdate({_id: id}, parametros, {new: true});

        if (!articuloActualizado){
            return res.status(404).json({
                status: "error",
                mensaje: "No se ha encontrado el articulo " + id + "."
            });
        }

        return res.status(200).json({
            status: "success",
            articulo: articuloActualizado,
            mensaje: "Articulo " + id + " actualizado."
        });
    }
    catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "No se pudo actualizar el articulo."
        });
    }
    


};

const subirArchivo = async (req, res) =>{

    // Configurar multer
    // Se hizo en el articulo.js de RUTAS (Linea 10)

    // Recoger fichero de imagen subido
    if (!req.file && !req.files){
        return res.status(404).json({
            status: "error",
            mensaje: "No se han encontrado archivos."
        });
    }

    // Conseguir el nombre del archivo o imagen
    let nombreArchivo = req.file.originalname;

    // Conseguir la extención del archivo
    let archivoExtencion = nombreArchivo.split("\."); // Con esto tomo lo que está después del punto. Y devuelve arreglo
    // Arreglo con 2 items, 1 del nombre y el otro de la extención.
    let extencion = archivoExtencion[1];

    // Comprobar la extención correcta
    if(extencion!= "png" && extencion!= "jpg" && extencion!= "gif" && extencion!= "jpeg"){
        // Borrar archivo y dar respuesta
        fs.unlink(req.file.path, ()=> {
            return res.status(400).json({
                status: "error",
                mensaje: "La extención del archivo no es correcta."
            });
        });
    }else{

        // Actualizar el articulo 
        try{
            // Recoger el id a editar
            let id = req.params.id;
    
            // Actualizar datos
            //const articuloActualizado = await Articulo.findOneAndUpdate({_id: id}, req.body);
            // Con ese "new: true" mostramos el objeto ya actualizado en la respuesta, ya que si no, muestra el anterior.
            const articuloActualizado = await Articulo.findOneAndUpdate({_id: id}, {imagen: req.file.filename}, {new: true});
            // Devolver respuesta
            if (!articuloActualizado){
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se ha encontrado el articulo " + id + "."
                });
            }
    
            return res.status(200).json({
                status: "success",
                articulo: articuloActualizado,
                fichero: req.file,
                mensaje: "Imagen del Articulo " + id + " actualizada."
            });
        }
        catch (error) {
            return res.status(500).json({
                status: "error",
                mensaje: "No se pudo actualizar el articulo."
            });
        }
    }
};

const imagen = (req, res)=>{
    let fichero = req.params.fichero.trim(); // trim() para limpiar la cadena.
    let ruta_fisica = "./imagenes/articulos/" + fichero;

    fs.stat(ruta_fisica, (error, existe)=>{
        if(existe){
            // Así se envían archivos
            return res.sendFile(path.resolve(ruta_fisica))
        }else{
            return res.status(404).json({
                status: "error",
                mensaje: "La imagen no existe.",
                ruta: ruta_fisica
            });
        }
    });

}

/*const imagen = (req, res) => {
    let fichero = req.params.fichero.trim(); // nombre del archivo desde los params
    let ruta_fisica = path.resolve(__dirname, '../imagenes/articulos/', fichero); 

    // Verificamos si el archivo existe
    fs.access(ruta_fisica, fs.constants.F_OK, (error) => {
        if (error) {
            // Archivo no encontrado
            return res.status(404).json({
                status: "error",
                mensaje: "La imagen no existe.",
                ruta: ruta_fisica
            });
        }

        // Si existe, enviamos el archivo
        return res.sendFile(ruta_fisica, (err) => {
            if (err) {
                console.error("Error al enviar el archivo:", err);
                res.status(500).json({
                    status: "error",
                    mensaje: "Hubo un problema al enviar el archivo."
                });
            }
        });
    });
};*/

const buscador = (req, res) =>{

    // Sacar el string a buscar
    let busqueda = req.params.key;

    // Find a la base de datos con condicion
    Articulo.find({
        "$or" : [
            {titulo: {"$regex" : busqueda, "$options": "i"}},
            {contenido: {"$regex" : busqueda, "$options": "i"}}
        ]
    }).sort({fecha: -1}).exec().then(articulos => {
        if(!articulos || articulos.length==0){
            return res.status(404).json({
                status: "404",
                mensaje: "No se han encontrado articulos."
            })
        }

        return res.status(200).json({
            status: "success",
            articulos: articulos
        })

    }).catch(error => {
        return res.status(500).json({
            status: "500",
            mensaje: "Error al buscar articulos articulos."
        })
    });

}

module.exports = {
    prueba,
    curso,
    crear,
    listar,
    unArticulo,
    borrar,
    actualizar,
    subirArchivo,
    imagen,
    buscador
};