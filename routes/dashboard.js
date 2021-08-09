const router = require('express').Router();

router.get('/', (req, res) => { //ruta de dashboard protegida
    res.json({
        error: null,
        data: {
            title: 'Ruta de dashboard, protegida...',
            payload: req.payload, //payload del jwt, esta propiedad se añade en el middlewate
        }
    })
})

module.exports = router