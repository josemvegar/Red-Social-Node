const Publication = require("../models/Publication");


// Guardar Publicación
const save = async (req, res) =>{
    // Recoger datos del body
    const params = req.body;

    // Respuesta negativa si no hay datos
    if (!params.text){
        return res.status(400).send({
            status: "error",
            message: "Debes enviar la información necesaria."
        })
    }

    // Crear y rellenar el objeto del modelo
    let newPublication = new Publication(params);
    newPublication.user = req.user.id;

    try{
        // Guardado del objeto en BD
        const savePublication = await newPublication.save();
        return res.status(200).send({
            status: "success",
            message: "Publicación Guardada.",
            savePublication
        })
    }
    catch(error){
        return res.status(400).send({
            status: "error",
            message: "No se ha guardado la publicación."
        })
    }
}

// Sacar una Publicación
const getOnePublication = async (req, res) => {
    // Sacar ID de la publicación de la URL
    const publicationID = req.params.id;

    try{
        // Find la condición del ID
        const getPublication = await Publication.findById(publicationID);

        // Devolver resultado


        return res.status(200).send({
            status: "success",
            message: "Mostrando Publicación.",
            publication: getPublication
        })

    }
    catch(error){
        return res.status(400).send({
            status: "error",
            message: "Error al mostrar la publicación."
        })
    }
}

// Eliminar Publicaciones
const removePublication = async (req,res) =>{
    // Sacar el id de la publicacion de eliminar
    const publicationID = req.params.id;

    // Find del id
    const publicationsToDelete = await Publication.find({"user": req.user.id, "_id": publicationID}); 

    // Remove y devolver Respuesta
    try{
        if(publicationsToDelete.length < 1){
            return res.status(400).send({
                status: "error",
                message: "Esta publicación no existe o no es tuya."
            })
        }
        const publicationDeleted= await Publication.deleteOne({"_id":publicationsToDelete[0]._id});
        return res.status(200).send({
            status: "success",
            message: "Acción de eliminar publicación",
            publicationDeleted: publicationsToDelete
        })
    }
    catch(error){
        return res.status(400).send({
            status: "error",
            message: "Error al eliminar la publicación."
        })
    }
}

// Listar Publicaciones de un Usuario en concreto
const listUserPublications = async (req, res) => {
    // Sacar el id del usuario
    let userId= req.params.id;

    // Si no hay id, el id es del logueado
    if(!userId){
        userId = req.user.id;
    }
    // Controlar la página
    let page= 1;
    if(req.params.page){
        page= parseInt(req.params.page);
    }
    const itemsPerPage = 5;

    // Find, Populate, ordenar, paginar
    const gettingPublications = await Publication.find({user: userId})
    .sort("-created_at") // El - se coloca para que sea lo contrario.
    .populate("user", "-password -role -__v")
    .paginate(page, itemsPerPage);
    const totalPublications = await Publication.find({user: userId});

    try{
        if(gettingPublications.length < 1){
            return res.status(400).send({
                status: "error",
                message: "No hay publicaciones hechas por este usuario."
            });
        }
        // Devolver la respuesta
        return res.status(200).send({
            status: "success",
            message: "Acción de listar publicaciones de un usuario.",
            page,
            total: totalPublications.length,
            pages: Math.ceil(totalPublications.length/itemsPerPage),
            publications: gettingPublications
        });
    }
    catch(error){

    }
}

// Listar Todas las Publicaciones (FEED)

// Subir Ficheros

// Devolver Archivos Multimedia


// Acciones de prueba
const pruebaPublication = (req, res) => {
    return res.status(200).send("<h1>Mensaje de prueba en Publication</h1>");
};

// Esportar acciones
module.exports = {
    pruebaPublication,
    save,
    getOnePublication,
    removePublication,
    listUserPublications
};