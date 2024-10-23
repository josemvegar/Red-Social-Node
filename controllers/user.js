// Acciones de prueba
const pruebaUser = (req, res) => {
    return res.status(200).send("<h1>Mensaje de prueba en Usuarios</h1>");
};

// Esportar acciones
module.exports = {
    pruebaUser
};