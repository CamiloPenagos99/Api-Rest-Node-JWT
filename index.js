const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
require('dotenv').config()

const app = express(); //iniciar express

// capturar body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Conexión a Base de datos
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.n0xg3.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
mongoose.connect(uri,
    { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log('Base de datos conectada'))
.catch(e => console.log('error db:', e))

//importar middleware

const auth =  require('./mid/auth');
const role =  require('./mid/authorization');
// import routes
const AuthRoute = require('./routes/routes');
//importar ruta
const dash = require('./routes/dashboard');



// route middlewares
app.use('/api/user', AuthRoute);

//middleware
app.use('/api/user/dash',role,auth,dash); //ruta protegida con autorizacion y autenticacion

app.get('/', (req, res) => {
    res.json({
        estado: true,
        mensaje: 'funciona!'
    })
});

// iniciar server
const PORT = process.env.PORT || 3800;
app.listen(PORT, () => {
    console.log(`servidor andando en: ${PORT}`);
})