// Se puede requerir asi sin desestructuración:
//const express = require("express");
//const router= express.Router();

// Y así con desestructuración:
const {Router} = require("express");
const router = Router();

// Importamos el multer para el manejo de imagenes
const multer = require("multer");
// Crear el almacenamiento (Configurar donde se guardan las imagenes)
const almacenamiento = multer.diskStorage({
    destination: function (req, file, cb) { //cb indica cual es el destino de la subida
        cb(null, './imagenes/articulos/'); // El primer parametro siempre es null
    },
    filename:  function (req, file, cb) {
        cb(null, "articulo" + Date.now() + file.originalname)
    }
});
// Le indicamos a multer cual es el almacenamiento
const subidas = multer({storage: almacenamiento})

// Cargar controlador de articulos
const ArticuloController = require("../controladores/articulo.js");

// Rutas de Prueba:
router.get("/ruta-de-prueba" , ArticuloController.prueba);
router.get("/curso" , ArticuloController.curso);

// Ruta Útil:
router.post("/crear" , ArticuloController.crear);
// Sin parametros:
//router.get("/articulos" , ArticuloController.listar)
// Con parámetros obligatorios:
//router.get("/articulos/:ultimos" , ArticuloController.listar)
// Con parámetros opcionales:
router.get("/articulos/:ultimos?" , ArticuloController.listar)
router.get("/articulo/:id" , ArticuloController.unArticulo);
router.delete("/articulo/:id" , ArticuloController.borrar);
router.put("/articulo/:id" , ArticuloController.actualizar);

// En esta ruta indicamos un middleware antes de que se ejecute la ruta, diciendo que_
//subidas es donde está configurado el multer
// single, porque es un solo archivo
// "file0" es el nombre del parametro recibido por post
router.post("/subir-imagen/:id", [subidas.single("file0")] , ArticuloController.subirArchivo);
router.get("/imagen/:fichero" , ArticuloController.imagen);

// BUSCADOR
router.get("/buscar/:key" , ArticuloController.buscador);

module.exports = router;