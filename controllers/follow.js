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
const unFollow = async (req, res) => {
    // Recoger el ID del usuario identificado
    const userId = req.user.id;

    // Recoger el ID del usuario que sigo y quiero dejar de seguir
    const followedId = req.params.id;

    // Find de las coincidencias
    let followToRemove = await Follow.find({
        user: userId,
        followed: followedId
    });

    try{
        if(!followToRemove || followToRemove.length < 1){
            return res.status(404).send({
                status: "error",
                message: "No sigues a este usuario."
            });
        }

        // Hacer un remove
        try{
            await Follow.deleteOne({ _id: followToRemove[0]._id });
        }catch(error){
            console.log(error);
            return res.status(400).send({
                status: "error",
                message: "Error al dejar de seguir este usuario...",
                error
            });
        }

        return res.status(200).send({
            status: "sucess",
            message: "Follow eliminado correctamente.",
            unfollow: followToRemove
        });
    }catch(error){
        console.log(error);
        return res.status(400).send({
            status: "error",
            message: "Error al dejar de seguir este usuario."
        });
    }
};

// Listado de usuarios que estoy siguiendo

// Listado de usuarios que me siguen

// Esportar acciones
module.exports = {
    pruebaFollow,
    save,
    unFollow
};