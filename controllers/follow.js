// Importar Modelo
const Follow = require("../models/Follow");
const User = require("../models/User");
const mongoosePaginate = require("mongoose-pagination");
const followService = require("../services/followService");

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

// Listado de usuarios que cualquier usuario está siguiendo
const following = async (req,res) => {
    // Sacar id de usuario identificado
    let userID= req.user.id;

    // Comprobar que llega el id por parámetro de url
    if(req.params.id) userID = req.params.id;

    // Comprobar si me llegó la página, si no, página 1
    let page= 1;
    if(req.params.page) page = req.params.page;

    // Cuantos usuarios por página
    const itemsPerPage = 5;

    // Find a follows, popular datos de usuarios, paginar con mongoose paginate
    let follows= await Follow.find({user: userID}).populate("followed", "-password -role -__v -email").paginate(page, itemsPerPage);
    const total = await Follow.countDocuments({ user: userID });

    try{
        
        const totalPages= Math.ceil(total / itemsPerPage);
        // Listado de usuarios de alguien que tambien me siguen a mi.
        // Sacar un array de los usuarios que me siguen y los que sigo como usuiario identificado.
        let followUserIds = await followService.followUserIds(req.user.id)

        return res.status(200).send({
            status: "success",
            message: "Listado de usuarios que estoy siguiendo.",
            follows,
            total,
            totalPages,
            user_following: followUserIds.followingClean,
            user_following_me: followUserIds.followersClean
        });
    }catch (error){
        return res.status(400).send({
            status: "error",
            message: "Error al mostrar el listado.",
            follows
        });
    }

    
};


// Listado de usuarios que siguen a cualquiero otro usuario
const followers = async (req,res) => {
    // Sacar id de usuario identificado
    let userID= req.user.id;

    // Comprobar que llega el id por parámetro de url
    if(req.params.id) userID = req.params.id;

    // Comprobar si me llegó la página, si no, página 1
    let page= 1;
    if(req.params.page) page = req.params.page;

    // Cuantos usuarios por página
    const itemsPerPage = 5;

    // Find a follows, popular datos de usuarios, paginar con mongoose paginate
    let follows= await Follow.find({followed: userID}).populate("user", "-password -role -__v -email").paginate(page, itemsPerPage);
    const total = await Follow.countDocuments({ followed: userID });

    try{
        
        const totalPages= Math.ceil(total / itemsPerPage);
        
        let followUserIds = await followService.followUserIds(req.user.id)

        return res.status(200).send({
            status: "success",
            message: "Listado de usuarios que me siguen.",
            follows,
            total,
            totalPages,
            user_following: followUserIds.followingClean,
            user_following_me: followUserIds.followersClean
        });
    }catch (error){
        return res.status(400).send({
            status: "error",
            message: "Error al mostrar el listado.",
            follows
        });
    }
};

// Esportar acciones
module.exports = {
    pruebaFollow,
    save,
    unFollow,
    following,
    followers
};