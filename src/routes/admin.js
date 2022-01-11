const express = require ('express');
const router = express.Router();

const Articulo = require('../models/ArticuloBD');
const Usuario = require('../models/InicioSesionBD');
const { isAuthenticated } = require('../helpers/auth');

const passport= require('passport');


router.get('/ViewArticulosAdmin', (req,res)=> { //REGISTRARSE PARA INICIAR SESION
    res.render('articulos/viewArticulos')
});

router.get('/Articulos/infoAdministrador', isAuthenticated, async (req, res) =>{
    const Administradores = await Usuario.find({ "TipoUsuario": "ADMINISTRADOR" }).sort({ matricula: 'asc' }).lean();
    res.render('admins/AdministradoresR',{Administradores})
});

router.get('/Articulos/infoUsuarios',  isAuthenticated, async (req, res) =>{
    const EscUsuarios = await Usuario.find({ "TipoUsuario": "USUARIO" }).sort({ matricula: 'asc' }).lean();                                
    res.render('admins/UsuariosR',{EscUsuarios})
});
router.get('/Articulos/infoArticulos',  isAuthenticated, async (req, res) =>{
    const Articulos = await Articulo.find().sort({id:'desc', date:'desc'}).lean();
    res.render('admins/ArticulosR',{Articulos})
});

router.get('/Articulos/infoReporteCompleto',  isAuthenticated, async (req, res) =>{
    const Articulos = await Articulo.find().sort({id:'desc', date:'desc'}).lean();
    const EscUsuarios = await Usuario.find({ "TipoUsuario": "USUARIO" }).sort({ matricula: 'asc' }).lean();
    const Administradores = await Usuario.find({ "TipoUsuario": "ADMINISTRADOR" }).sort({ matricula: 'asc' }).lean();
    const nombreUser = await Usuario.findById(req.user.id).lean()       
    res.render('admins/Reportes',{Articulos, EscUsuarios, Administradores, nombreUser})
});

router.get('/Logout', (req, res) => {
    req.logOut();
    res.redirect('/');

});

module.exports = router;

 