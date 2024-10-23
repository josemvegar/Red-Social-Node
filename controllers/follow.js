// Acciones de prueba
const pruebaFollow = (req, res) => {
    return res.status(200).send("<h1>Mensaje de prueba en Follow</h1>");
};

// Esportar acciones
module.exports = {
    pruebaFollow
};