// { conexion } asi para desestructurar el objeto y que venga la función de una vez.
const { conexion } = require("./basedatos/conexion");
// Requerimos express:
const express = require("express");
// Requerimos cors:
const cors = require("cors");

// Inicializar App
console.log("App de Nodejs Arrancada");

// Conectar a la Base de Datos.
conexion();

// Crear la variable del  servidor node.
const app = express();
const port = 3900;

// Configurar el cors. (Para que se ejecute el cors antes de que se ejecute otra cosa como una ruta.)
app.use(cors());

// Convertir body a un objeto js. Con esto se parsea siempre los datos que lleguen a que sean un objeto js
app.use(express.json()); // Recibir datos con contente-type app/json
app.use(express.urlencoded({extended:true})); // Toma los datos en formato urlencodes y los parsea a un objeto json.

// Crear Rutas:
const rutas_articulo = require("./rutas/articulo");

// Cargando las rutas:
app.use("/api", rutas_articulo)

// RUTAS DE PRUEBA HARDCODEADAS
app.get("/", (req, res) =>{
    
    // Asi para cuando puede ser cualquier cosa como incluso un html con comillas invertidas:
    return res.status(200).send("<h1>Empezando a crear un API REST con NodeJS.</h1>");
});

app.get("/probando", (req, res) =>{
    console.log("Se ha ejecutado el endpoint Probando")
    // Asi para cuando puede ser cualquier cosa como incluso un html con comillas invertidas:
    //return res.status(200).send("Probando las rutas con Node");

    // Así para devolver un Json:
    return res.status(200).json([{
        curso: "Master en Node",
        alumno: "José Vega",
        url: "/probando"
    },
    {
        curso: "Master en Node",
        alumno: "José Vega",
        url: "/probando"
    }
    ]);
});

// Crear el servidor y escuchar peticiones http.
app.listen(port, () =>{
    console.log("Servidor Corriendo en el puerto " + port)
});