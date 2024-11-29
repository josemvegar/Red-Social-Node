// Importar Modelo
const Follow = require("../models/Follow");
const User = require("../models/User");

// Acciones de prueba
const pruebaFollow = (req, res) => {
    return res.status(200).send("<h1>Mensaje de prueba en Follow</h1>");
};

// Acción de guardar un follow (Seguir)
const save = async (req,res) => {
    // Conseguir datos del body
    let params = req.body;

    // Sacar id del usuario identificado
    const identity = req.user;

    // Validar tamaño del id
    if(params.followed.length != 24){
        return res.status(400).send({
            status: "error",
            message: "Id de usuario no válido."
        });
    }

    // Crear Objeto con modelo Follow
    let userToFollow = new Follow({
        user: identity.id,
        followed: params.followed
    });

    // Guardar el objeto en la bd
    const followedSearch = await User.findById(params.followed)
    const userFollowed = await Follow.find({$and: [{user: identity.id},{followed: params.followed}]});

    try{
        if(userFollowed.length > 0){
            return res.status(400).send({
                status: "error",
                message: "Ya sigues a este usuario."
            });
        }
        if(!followedSearch){
            return res.status(400).send({
                status: "error",
                message: "Id de usuario no encontrado."
            });
        }
        const followSaved = await userToFollow.save();
        if(!followSaved){
            return res.status(400).send({
                status: "error",
                message: "No se ha podido seguir al usuario."
            });
        }
        return res.status(200).send({
            status: "success",
            userToFollow
        });
    }catch (error){
        return res.status(400).send({
            status: "error",
            message: "No se ha podido seguir al usuario."
        });
    }
}
// Acción de borrar un follow (Dejar de seguir)

// Listado de usuarios que estoy siguiendo

// Listado de usuarios que me siguen

// Esportar acciones
module.exports = {
    pruebaFollow,
    save
};