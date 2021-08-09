const jwt = require('jsonwebtoken') //importar jwt
const User = require('../models/User') //eschema de mongo

// middleware to validate token (rutas protegidas)
const authenticated = async (req, res, next) => {
    const token = req.header('auth-token') //recuperar el token del header
    if (!token) return res.status(401).json({ error: 'Acceso denegado' }) //no tiene token, no permitir acceso
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET) //validez del token
        const user = await User.findOne(verified._id);  //verificar que el usuario este en la base de datos
        if(user) req.payload = verified //agregar propiedad payload al request, para usar en rutas protegidas
        else return res.status(401).json({error: true, msg: 'el usuario no se encuentra en la base de datos'}) //enviar error
        next() // continuamos con otro mid, ruta
    } catch (error) {
        res.status(401).json({error: 'token no es válido'})
    }
}




module.exports = authenticated;

