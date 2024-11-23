const mongoose = require('mongoose');

const connection = async () => {
    try {
        //await mongoose.connect("mongodb://127.0.0.1:27017/mi_redsocial");
 const stringConection = "mongodb+srv://josevega199916:yukrWGDoHrpIKAp6@cluster0.rz9qw.mongodb.net/mi_redsocial?retryWrites=true&w=majority";
        await mongoose.connect('mongodb+srv://josevega199916:yukrWGDoHrpIKAp6@cluster0.rz9qw.mongodb.net/mi_redsocial?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
        console.log("Conectado correctamente a BD: mi_redsocial.")
    }
    catch(error) {
        console.log(error);
        throw new Error("No se ha podido conectar a la base de datos.")
    }
};

module.exports = {
    connection
};