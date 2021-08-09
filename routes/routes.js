const router = require('express').Router(); //manejador de rutas
const User = require('../models/User') //eschema de mongo
const Joi = require("@hapi/joi"); //validaciones de login
const bcrypt = require ("bcrypt");
const jwt = require("jsonwebtoken"); //importar jwt

const schemaRegister = Joi.object({ //validar en hapi
    name: Joi.string().min(6).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
    role: Joi.string().min(4).max(255).required(),

})

const schemaLogin = Joi.object({ //validar en hapi
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required()
})

//*
// EndPoint para loguear usuarios
//*

router.post('/login', async (req,res)=>{
    //validacion de usuarios
    const { error } = schemaLogin.validate(req.body);//validar el body de la solicitud

    if(error){
        return res.status(400).json( //validar error y mensaje de validacion para el request
            {error: error.details[0].message}
        )
    } //validar el error y detalles de la validacion

    //validar existencia de usuario
    const user = await User.findOne({email: req.body.email});
    if(!user){
        return res.status(400).json({error: "true" , error: "El usuario no esta registrado"});
    }

    //validar la contraseña

    const passwordValidate = await bcrypt.compare(req.body.password, user.password)
    if(!passwordValidate) {
        return res.status(400).json({error: true, msg: "Contraseña errornea"});
    }

    //json web token
    const token = jwt.sign({ 
        name: user.name, //payload
        id: user._id
    }, process.env.TOKEN_SECRET) //token 

    //Login correcto
    res.header('auth-token', token).json({
        error: null,
        data: {token}
    })
    
})

//*
// EndPoint para registrar usuarios
//*

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
        return res.status(400).json({error:true , msg: "El email ya esta registrado"});
    }

    //Hash contraseña
    const hash = await bcrypt.genSalt(10); //cantidad de saltos de cifrado
    const password = await bcrypt.hash(req.body.password, hash); //hashear la contraseña


    const _user = new User({ //crear instancia de mongoose eschema
        name: req.body.name,
        email: req.body.email,
        password: password
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
