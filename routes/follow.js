const express = require("express");
const router = express.Router();
const followController = require("../controllers/follow");
const auth = require("../middlewares/auth");

// Definir rutas
router.get("/prueba-follow", followController.pruebaFollow);
router.post("/save", auth.auth, followController.save);
router.delete("/unfollow/:id", auth.auth, followController.unFollow);
router.get("/following/:id?/:page?", auth.auth, followController.following);
router.get("/followers/:id?/:page?", auth.auth, followController.followers);

// Exportar el router
module.exports = router;