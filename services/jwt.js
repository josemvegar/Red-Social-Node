// Importar dependencias
const jwt = require("jwt-simple");
const moment = require("moment");

// Clave secreta
const secret = "CLAVE_SECRETA_DEL_CURSO_DEL_PROYECTO_DE_LA_RED_SOCIAL_987987";

// Funcion para generar tokens
const createToken = (user) => {

    const payload={
        id: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        mail: user.mail,
        role: user.role,
        imagen: user.imagen,
        iat: moment().unix(),  // Fecha exacta de su creación
        exp: moment().add(30, "days").unix() // Fecha de expiración
    };

    // Devolver token codificado
    return jwt.encode(payload, secret);

};

module.exports= createToken;