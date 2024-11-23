// Importar Módulos i deendencias
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Acciones de prueba
const pruebaUser = (req, res) => {
  return res.status(200).send("<h1>Mensaje de prueba en Usuarios</h1>");
};

const register = (req, res) => {
  // Recoger datos de la petición
  let params = req.body;

  // Comprobar datos que llegan + Validación
  if (!params.name || !params.email || !params.password || !params.nick) {
    console.log("Validación mínima no pasada.");
    return res.status(404).json({
      status: "error",
      message: "Faltan datos por enviar.",
    });
  } else {
    console.log("Validación mínima pasada.");

    // Crear objeto de usuario con los datos recibidos.
    let userToSave = new User(params);

    // Control de Usuario Duplicados
    User.find({
      $or: [
        { email: userToSave.email.toLowerCase() },
        { nick: userToSave.nick.toLowerCase() },
      ],
    })
      .exec()
      .then((userDuplicated) => {
        if (userDuplicated && userDuplicated.length > 0) {
          return res.status(400).json({
            status: "error",
            message: "Ya hay un usuario registrado con estos datos.",
          });
        }

        console.log("Usuario Nuevo.");

        // Cifrar la contraseña
        bcrypt.hash(userToSave.password, 10, (err, pwd) => {
          userToSave.password = pwd;

          // Guardar usuario en la BD
          userToSave.save().then(userStored => {
            if (!userStored) {
                return res.status(500).json({
                    status: "error",
                    message: "Error al guardar el usuario.",
                  });
            }

            // Devolver el resultado

            return res.status(200).json({
                status: "success",
                message: "Usuario " + userStored.nick + " Guardado.",
                userStored
              });
          })
          .catch( error => {
            return res.status(500).json({
                status: "error",
                message: "Error al guardar el usuario.",
              });
          });


        });
      })
      .catch((error) => {
        return res.status(500).json({
          status: "error",
          message: "Error en la consulta de usuarios.",
        });
      });
  }
};

// Esportar acciones
module.exports = {
  pruebaUser,
  register,
};
