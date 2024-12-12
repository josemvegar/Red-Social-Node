const express = require("express");
const router = express.Router();
const publicationController = require("../controllers/publication");
const auth = require("../middlewares/auth");

// Definir rutas
router.get("/prueba-publication", publicationController.pruebaPublication);
router.post("/save", auth.auth, publicationController.save);
router.get("/publication/:id", auth.auth, publicationController.getOnePublication);
router.delete("/delete/:id", auth.auth, publicationController.removePublication);
router.get("/userlist/:id?/:page?", auth.auth, publicationController.listUserPublications);

// Exportar el router
module.exports = router;