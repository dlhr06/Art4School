const helpers={};

helpers.isAuthenticated = (req, res, next) =>{
    if (req.isAuthenticated()){
        return next ();
    }
    req.flash ('error_msg',  ' No Autorizado para esta accion');
    res.redirect('/IniciaSesion');
};

module.exports = helpers;