const express = require("express");
const router = express.Router();
const publicationController = require("../controllers/publication");
const auth = require("../middlewares/auth");
const multer = require("multer");

// Configuración de subida de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,"./uploads/publications");
    },
    filename: (req, file, cb) => {
        cb(null, "pub-"+Date.now()+"-"+file.originalname);
    }
});

const uploads = multer({storage});

// Definir rutas
router.get("/prueba-publication", publicationController.pruebaPublication);
router.post("/save", auth.auth, publicationController.save);
router.get("/publication/:id", auth.auth, publicationController.getOnePublication);
router.delete("/delete/:id", auth.auth, publicationController.removePublication);
router.get("/userlist/:id?/:page?", auth.auth, publicationController.listUserPublications);
router.post("/upload/:id" , [auth.auth, uploads.single("file0")], publicationController.upload);
router.get("/media/:file", auth.auth, publicationController.media);

// Exportar el router
module.exports = router;