const express = require ('express');
const router = express.Router();

const passport= require('passport');


router.get('/ViewArticulosAdmin', (req,res)=> { //REGISTRARSE PARA INICIAR SESION
    res.render('articulos/viewArticulos')
});

router.get('/RegistrarAdministrador', (req,res)=> { //REGISTRARSE PARA INICIAR SESION
    res.render('user/RegistrarAdmin')
});

router.get('/Logout', (req, res) => {
    req.logOut();
    res.redirect('/');

});

module.exports = router;

 