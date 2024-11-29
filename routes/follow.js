const express = require("express");
const router = express.Router();
const followController = require("../controllers/follow");
const auth = require("../middlewares/auth");

// Definir rutas
router.get("/prueba-follow", followController.pruebaFollow);
router.post("/save", auth.auth, followController.save);

// Exportar el router
module.exports = router;