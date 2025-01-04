const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const auth = require("../middlewares/auth");
const multer = require("multer");

// Configuración de subida de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,"./uploads/avatars");
    },
    filename: (req, file, cb) => {
        cb(null, "avatar-"+Date.now()+"-"+file.originalname);
    }
});

const uploads = multer({storage});

// Definir rutas
router.get("/prueba-user", auth.auth, userController.pruebaUser);
router.post("/register", userController.register);
router.post("/login", userController.login);
//router.get("/profile/:id", auth.auth, userController.profile);
router.get("/profile/:id?", auth.auth, userController.profile);
router.get("/list/:page?", auth.auth, userController.list);
router.put("/update/:id", auth.auth, userController.update);
router.post("/upload", [auth.auth, uploads.single("avatar")], userController.upload);
router.get("/avatar/:file", userController.avatar);
router.get("/counters/:id?", auth.auth, userController.counters);

// Exportar el router
module.exports = router;