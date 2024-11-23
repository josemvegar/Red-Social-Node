const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

// Definir rutas
router.get("/prueba-user", userController.pruebaUser);
router.post("/register", userController.register);

// Exportar el router
module.exports = router;