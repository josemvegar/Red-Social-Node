// Se puede requerir asi sin desestructuración:
//const express = require("express");
//const router= express.Router();

// Y así con desestructuración:
const {Router} = require("express");
const router = Router();

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

module.exports = router;