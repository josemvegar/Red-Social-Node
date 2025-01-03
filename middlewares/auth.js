// Importar módulos
const jwt = require("jwt-simple");
const moment = require("moment");

// Importar Clave secreta
const libJwt = require("../services/jwt");
const secret = libJwt.secret;

// Middleware de autenticación
exports.auth = (req, res, next) => {
    // Comprobar si llega la cabecera de autenticación
    let token = req.headers.token
    if(!token){
        return res.status(400).json({
            status: "error",
            message: "La petición no tiene la cabecera de autenticación."
        });
    }

    // Limpiar el token
    token= token.replace(/['"]+/g, ''); // Expreción regular para limpiar el token.

    // Decodificar el token
    try{
        let payload = jwt.decode(token, secret);

        // Comprobar expiración.
        if(payload.exp <= moment().unix()){
            return res.status(401).json({
                status: "error",
                message: "Token Expirado."
            });
        }
        // Agregar datos de usuario a la request
        req.user = payload;

        // Pasar a la ejecución de la ruta.
        next();

    }catch(error){
        return res.status(400).json({
            status: "error",
            message: "Token Inválido."
        });
    }

    
};

