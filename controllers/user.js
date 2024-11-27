// Importar Módulos i deendencias
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { use } = require("../routes/user");
const jwt = require("../services/jwt");
const mongoosePagination = require("mongoose-pagination");

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
          userToSave
            .save()
            .then((userStored) => {
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
                userStored,
              });
            })
            .catch((error) => {
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

const login = (req, res) => {
  // Recoger parámetros del body
  const params = req.body;

  // Buscar en la BD si existe el usuario
  if (!params.email || !params.nick || !params.password) {
    return res.status(400).json({
      status: "Error",
      message: "Faltan datos por enviar.",
    });
  } else {
    User.findOne({ $and: [{ email: params.email }, { nick: params.nick }] })
      //.select({ password: 0 }) // Con esto seleccionamos qué trae y qué no, 0 es false y 1 es true.
      .exec()
      .then((user) => {
        if (!user) {
          return res.status(400).json({
            status: "Error",
            message: "Usuario no encontrado.",
          });
        } else {
          // Comprobar su contraseña
          let pwd = bcrypt.compareSync(params.password, user.password);
          if (!pwd) {
            return res.status(400).json({
              status: "Error",
              message: "Contraseña inválida.",
            });
          }

          // Crear token
          const token = jwt.createToken(user);
          //const token= false;

          // Devolver datos de usuario y Token JWT
          return res.status(200).json({
            status: "sucess",
            message: "Te has identificado correctamente.",
            user: {
              id: user._id,
              name: user.name,
              nick: user.nick,
              token,
            },
          });
        }
      })
      .catch((error) => {
        return res.status(500).json({
          status: "Error",
          message: "Error al buscar usuario (Servidor)",
        });
      });
  }
};

const profile = async (req, res) => {
  // Recibir el parámetro del id del usuario por la url
  const id = req.params.id;

  // Consulta para sacar los datos del usuario
  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "No has enviado el ID del usuario.",
    });
  }
  if (id.length != 24) {
    return res.status(400).json({
      status: "error",
      message: "ID de usuario inválido, éste debe ser de 24 caracteres.",
    });
  }
  try {
    const userProfile = await User.findById(id)
      .select({ password: 0, role: 0 })
      .exec();

    if (!userProfile) {
      return res.status(404).json({
        status: "error",
        message: "El usuario no existe.",
      });
    }

    // POSTERIORMENTE: Devolver información de follows.
    // Devolver resultado
    return res.status(200).json({
      status: "success",
      user: userProfile,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "Hubo un error al buscar el perfil o el Usuario no existe.",
    });
  }
};

const list = async (req, res) => {
  // Controlar en qué página estamos
  let page = 1;
  if (req.params.page) {
    page = req.params.page;
  }

  page = parseInt(page);

  // Consulta con mongoose pagination
  let itemsPerPage = 5;

  try {
    let userList = await User.find()
      .sort("_id")
      .select({ password: 0, role: 0 })
      .paginate(page, itemsPerPage);
    const totalUsers = await User.countDocuments();

    if (!userList) {
      return res.status(404).send({
        status: "error",
        message: "No hay usuarios para mostrar.",
      });
    }

    // Devolver el resultado (Posteriormente info de Follows)
    let baseUrl = req.originalUrl.replace(/\/\d+$/, "/");
    let totalPages = Math.ceil(totalUsers / itemsPerPage);
    let prev = page - 1;
    let next = page + 1;

    if (prev < 1) {
      prev = undefined;
    } else {
      if (prev > totalPages) {
        prev = totalPages;
      }
    }

    if (next > totalPages) {
      next = undefined;
    }

    console.log(req);
    return res.status(200).send({
      status: "sucess",
      userList,
      page,
      itemsPerPage,
      total: totalUsers,
      pages: totalPages,
      prev: prev ? baseUrl + prev : undefined,
      next: next ? baseUrl + next : undefined,
    });
  } catch (error) {
    return res.status(400).send({
      status: "error",
      message: "Hubo un error al mostrar los usuarios.",
    });
  }
};

const update = async (req, res) => {
  // Recoger la información del usuario a actualizar.
  let userIdentity = req.user;
  let userToUpdate = req.body;

  // Eliminar campos sobrantes.
  delete userToUpdate.iat;
  delete userToUpdate.exp;
  delete userToUpdate.role;
  delete userToUpdate.imagen;

  // Comprobar si el usuario existe
  User.find({
    $or: [
      { email: userToUpdate.email.toLowerCase() },
      { nick: userToUpdate.nick.toLowerCase() },
    ],
  })
    .exec()
    .then((userDuplicated) => {
      let userIsset = false;
      userDuplicated.forEach((user) => {
        if (user && user._id != userIdentity.id) {
          userIsset = true;
        }
      });

      if (userIsset == true) {
        return res.status(400).json({
          status: "error",
          message: "Ya hay un usuario registrado con estos datos.",
        });
      }

      // Si llega cambio de contraseña, cifrarla
      if (userToUpdate.password) {
        /*bcrypt.hash(userToUpdate.password, 10, (err, pwd) => {
          userToUpdate.password = pwd;
        });*/

        bcrypt
          .hash(userToUpdate.password, 10)
          .then((pwd) => {
            userToUpdate.password = pwd;

            //Buscar y actualizar
            User.findByIdAndUpdate(userIdentity.id, userToUpdate, {new: true}).then( (userUpdated) => {
              return res.status(200).send({
                status: "sucess",
                message: "Usuario actualizado.",
                user: userUpdated
              })
            })
              .catch ((error) => {
                return res.status(400).json({
                  status: "error",
                  message: "Hubo un error al actualizar los datos.",
                });
              });

          })
          .catch((err) => {
            console.error("Error hashing password:", err);
          });
      } else {
        //Buscar y actualizar
        User.findByIdAndUpdate(userIdentity.id, userToUpdate, {new: true}).then( (userUpdated) => {
          return res.status(200).send({
            status: "sucess",
            message: "Usuario actualizado.",
            user: userUpdated
          })
        })
          .catch ((error) => {
            return res.status(400).json({
              status: "error",
              message: "Hubo un error al actualizar los datos.",
            });
          });
      }
    })
    .catch((error) => {
      return res.status(500).json({
        status: "error",
        message: "Error en la consulta de usuarios.",
      });
    });
};

// Esportar acciones
module.exports = {
  pruebaUser,
  register,
  login,
  profile,
  list,
  update,
};
