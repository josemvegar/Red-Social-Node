const express = require("express");
const router = express.Router();
const publicationController = require("../controllers/publication");

// Definir rutas
router.get("/prueba-publication", publicationController.pruebaPublication);

// Exportar el router
module.exports = router;