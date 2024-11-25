const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const auth = require("../middlewares/auth");

// Definir rutas
router.get("/prueba-user", auth.auth, userController.pruebaUser);
router.post("/register", userController.register);
router.post("/login", userController.login);
//router.get("/profile/:id", auth.auth, userController.profile);
router.get(["/profile", "/profile/:id"], auth.auth, userController.profile);

// Exportar el router
module.exports = router;