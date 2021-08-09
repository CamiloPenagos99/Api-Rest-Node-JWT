//middleware de autorizacion
const hasRole = (req,res,next)=>{
    if(req.body.role=="user"){
        next()
    }
    else{
        res.status(403).json({
            error: true,
            msg: "No tiene el rol autorizado"
        })
    }
}

module.exports = hasRole;