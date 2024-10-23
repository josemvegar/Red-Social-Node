// Acciones de prueba
const pruebaPublication = (req, res) => {
    return res.status(200).send("<h1>Mensaje de prueba en Publication</h1>");
};

// Esportar acciones
module.exports = {
    pruebaPublication
};