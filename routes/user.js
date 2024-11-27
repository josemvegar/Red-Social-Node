const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const auth = require("../middlewares/auth");

// Definir rutas
router.get("/prueba-user", auth.auth, userController.pruebaUser);
router.post("/register", userController.register);
router.post("/login", userController.login);
//router.get("/profile/:id", auth.auth, userController.profile);
router.get(["/profile/:id?"], auth.auth, userController.profile);
router.get(["/list/:page?"], auth.auth, userController.list);
router.put(["/update/:id"], auth.auth, userController.update);

// Exportar el router
module.exports = router;