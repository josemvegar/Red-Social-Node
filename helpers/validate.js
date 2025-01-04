const validator = require("validator");

const validate= (params) => {
    const name =    !validator.isEmpty(params.name) &&
                    validator.isLength(params.name, {min: 3, max: undefined}) &&
                    validator.isAlpha(params.name, "es-ES");

    const surname = !validator.isEmpty(params.surname) &&
                    validator.isLength(params.surname, {min: 3, max: undefined}) &&
                    validator.isAlpha(params.surname, "es-ES");

    const nick = !validator.isEmpty(params.nick) &&
                validator.isLength(params.nick, {min: 2, max: undefined});

    const email = !validator.isEmpty(params.email) &&
                    validator.isEmail(params.email);

    const password = !validator.isEmpty(params.password) &&
                    validator.isLength(params.password, {min: 8, max: undefined});

    let bio= "bio";
    if(params.bio){
        bio = validator.isLength(params.bio, {min: 0, max: 255});
    }

    if (!name || !surname || !nick || !email || !password || !bio){
        throw new Error("No se ha superado la validación");
    }else{
        console.log("Validación Avanzada Superada.")
    }

};

module.exports = validate;