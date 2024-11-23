// Importar dependencias
const {connection} = require("./database/connection");
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user");
const publicationRoutes = require("./routes/publication");
const followRoutes = require("./routes/follow");

// Mensaje de bienvenida
console.log("API Node para red social arrancada.");

// Conexión a la bd
connection();

// Crear Servidor de Node
const app = express();
const port = 3900;

// Configurar el Cors
app.use(cors());

// Convertir los datos del body a objetos js
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Cargar conf rutas
app.use("/api/user", userRoutes);
app.use("/api/publication", publicationRoutes);
app.use("/api/follow", followRoutes);

// Ruta de prueba
app.get("/prueba" , (req, res) => {
    return res.status(200).json(
        {
            mensaje: "App iniciada"
        }
    )
})

// Poner el servidor a escuchar peticiones http
app.listen(port, () => {
    console.log("Servidor de node corriendo en el puerto: " + port);
});