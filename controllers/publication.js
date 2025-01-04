const Publication = require("../models/Publication");
const fs = require("fs");
const path = require("path");
const followService = require("../services/followService");

// Guardar Publicación
const save = async (req, res) => {
  // Recoger datos del body
  const params = req.body;

  // Respuesta negativa si no hay datos
  if (!params.text) {
    return res.status(400).send({
      status: "error",
      message: "Debes enviar la información necesaria.",
    });
  }

  // Crear y rellenar el objeto del modelo
  let newPublication = new Publication(params);
  newPublication.user = req.user.id;

  try {
    // Guardado del objeto en BD
    const savePublication = await newPublication.save();
    return res.status(200).send({
      status: "success",
      message: "Publicación Guardada.",
      savePublication,
    });
  } catch (error) {
    return res.status(400).send({
      status: "error",
      message: "No se ha guardado la publicación.",
    });
  }
};

// Sacar una Publicación
const getOnePublication = async (req, res) => {
  // Sacar ID de la publicación de la URL
  const publicationID = req.params.id;

  try {
    // Find la condición del ID
    const getPublication = await Publication.findById(publicationID);

    // Devolver resultado

    return res.status(200).send({
      status: "success",
      message: "Mostrando Publicación.",
      publication: getPublication,
    });
  } catch (error) {
    return res.status(400).send({
      status: "error",
      message: "Error al mostrar la publicación.",
    });
  }
};

// Eliminar Publicaciones
const removePublication = async (req, res) => {
  // Sacar el id de la publicacion de eliminar
  const publicationID = req.params.id;

  // Find del id
  const publicationsToDelete = await Publication.find({
    user: req.user.id,
    _id: publicationID,
  });

  // Remove y devolver Respuesta
  try {
    if (publicationsToDelete.length < 1) {
      return res.status(400).send({
        status: "error",
        message: "Esta publicación no existe o no es tuya.",
      });
    }
    const publicationDeleted = await Publication.deleteOne({
      _id: publicationsToDelete[0]._id,
    });
    return res.status(200).send({
      status: "success",
      message: "Acción de eliminar publicación",
      publicationDeleted: publicationsToDelete,
    });
  } catch (error) {
    return res.status(400).send({
      status: "error",
      message: "Error al eliminar la publicación.",
    });
  }
};

// Listar Publicaciones de un Usuario en concreto
const listUserPublications = async (req, res) => {
  // Sacar el id del usuario
  let userId = req.params.id;

  // Si no hay id, el id es del logueado
  if (!userId) {
    userId = req.user.id;
  }
  // Controlar la página
  let page = 1;
  if (req.params.page) {
    page = parseInt(req.params.page);
  }
  const itemsPerPage = 5;

  // Find, Populate, ordenar, paginar
  const gettingPublications = await Publication.find({ user: userId })
    .sort("-created_at") // El - se coloca para que sea lo contrario.
    .populate("user", "-password -role -__v -email")
    .paginate(page, itemsPerPage);
  const totalPublications = await Publication.find({ user: userId });

  try {
    if (gettingPublications.length < 1) {
      return res.status(400).send({
        status: "error",
        message: "No hay publicaciones hechas por este usuario.",
      });
    }
    // Devolver la respuesta
    return res.status(200).send({
      status: "success",
      message: "Acción de listar publicaciones de un usuario.",
      page,
      total: totalPublications.length,
      pages: Math.ceil(totalPublications.length / itemsPerPage),
      publications: gettingPublications,
    });
  } catch (error) {
    return res.status(400).send({
      status: "error",
      message: "Error al listar las publicaciones hechas por este usuario.",
    });
  }
};

// Subir Ficheros
const upload = async (req, res) => {
  // Sacar Publication ID
  const publicationId = req.params.id;

  // Recoger fichero de iamgen y comprobar que existe
  if (!req.file && !req.files) {
    return res.status(404).send({
      status: "error",
      message: "La petición no incluye la imagen.",
    });
  }

  // Conseguir el nombre del archivo
  let image = req.file.originalname;

  //Sacar la extención del archivo
  let imageSplit = image.split(".");
  let extension = imageSplit[1];

  // Comprobar la extención
  if (
    extension != "png" &&
    extension != "jpg" &&
    extension != "jpeg" &&
    extension != "gif"
  ) {
    // Si no es correcta, se borra el archivo
    const filePath = req.file.path;
    const fileDeleted = fs.unlinkSync(filePath);

    // Devolver respuesta negativa
    return res.status(400).send({
      status: "error",
      message: "El archivo no es del formato correcto.",
      extension: imageSplit[imageSplit.length - 1],
    });
  }

  // Si es correcta se guarda su nombre en la bd
  const publicationUpdated = await Publication.findOneAndUpdate(
    { user: req.user.id, _id: publicationId },
    { file: req.file.filename },
    { new: true }
  );
  try {
    if (!publicationUpdated) {
      const filePath = req.file.path;
      const fileDeleted = fs.unlinkSync(filePath);
      return res.status(400).send({
        status: "error",
        message: "Error al actualizar imagen en la base de datos.",
        extension,
      });
    }

    // Devolver respuesta
    return res.status(200).send({
      status: "succes",
      user: publicationUpdated,
    });
  } catch {
    const filePath = req.file.path;
    const fileDeleted = fs.unlinkSync(filePath);
    return res.status(400).send({
      status: "error",
      message: "Error al actualizar imagen en la base de datos.",
    });
  }
};
// Devolver Archivos Multimedia
const media = (req, res) => {
  // Sacar el parametro de la url
  const file = req.params.file;

  // Montar el path de la imagen
  const filePath = "./uploads/publications/" + file;

  // Comprobar que el archivo existe
  fs.stat(filePath, (err, exists) => {
    if (!exists) {
      return res.status(404).send({
        status: "error",
        message: "El archivo no existe.",
      });
    }
    // Devolver un archivo
    return res.sendFile(path.resolve(filePath));
  });
};

// Listar Todas las Publicaciones (FEED)

const feed = async (req, res) => {
  // Sacar la página actual
  let page = 1;
  if (req.params.page) {
    page = req.params.page;
  }

  // Establecer número de elementos por página
  let itemsPerPage = 5;

  // Sacar un array de identificadores de usuarios a quien sigo como user identificado
  try {
    let myFollows = await followService.followUserIds(req.user.id);

    // Find a publicaciones  usando IN, ordenar, popular usuario y paginar
    const feed = await Publication.find({
      user: myFollows.followingClean
      // o
      //user: {$in : myFollows.followingClean}
    })
    .sort("-created_at")
    .populate("user", "-password -role -__v -email -crate_at")
    .paginate(page, itemsPerPage);

    let totalPublications= await Publication.find({user: {$in : myFollows.followingClean}});
    let total = totalPublications.length;

    if( total < 1){
      return res.status(400).send({
        status: "error",
        message: "No hay publicaciones para mostrar.",
      });
    }

    return res.status(200).send({
      status: "success",
      message: "Feed",
      following : myFollows.followingClean,
      feed,
      page,
      itemsPerPage,
      total
    });

  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "No se han listado las publicaciones del feed",
    });
  }
};

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
  listUserPublications,
  upload,
  media,
  feed,
};
