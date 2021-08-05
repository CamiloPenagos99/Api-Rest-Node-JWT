const router = require('express').Router(); //manejador de rutas
const User = require('../models/User') //eschema de mongo
const Joi = require("@hapi/joi"); //validaciones de login

const schemaRegister = Joi.object({ //validar en hapi
    name: Joi.string().min(6).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required()
})





router.post('/register', async (req,res)=>{

    //validacion de usuarios

    const { error } = schemaRegister.validate(req.body);//validar el body de la solicitud

    if(error){
        return res.status(400).json( //validar error y mensaje de validacion para el request
            {error: error.details[0].message}
        )
    } //validar el error y detalles de la validacion
    
    //verificar si existe el email
    const validateEmail = await User.findOne({email:req.body.email});
    if(validateEmail) { //existe duplicidad de email y envia error
        return res.status(400).json({error: "El email ya esta registrado"});
    }


    const _user = new User({ //crear instancia de mongoose eschema
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })

    try {
        const savedUser = await _user.save(); //trabajar asincrono, como sincrono
        res.status(200).json({
            error: null,
            data: savedUser
        })
    } catch (error) {
        res.status(400).json({error})
    }
})

module.exports = router;
