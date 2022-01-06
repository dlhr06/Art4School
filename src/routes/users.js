const express = require('express');
const router = express.Router();
const User = require('../models/InicioSesionBD');
const passport = require('passport');

router.get('/IniciaSesion', (req, res) => {
    res.render('user/Ingresar');
});

router.post('/user/IngresarUsuario', passport.authenticate("IngresoUsuario", {
    successRedirect: '/Articulos',
    failureRedirect: '/IniciaSesion',   
    failureFlash: true
}));

router.get('/Registrate', (req, res) => { //REGISTRARSE PARA INICIAR SESION
    res.render('user/Registrarse')
});

router.post('/user/Registrarse', async (req, res) => {
    const { TipoUsuario, CURP, name, apellidoP, apellidoM, edad, Direccion, telefono, CVU, RFC, FNacimiento, LNacimiento, grado, matricula, email, password, cpassword } = req.body;
    const errors = [];
    if (password != cpassword) {
        errors.push({ text: 'La contraseña no coincide, vuelva a intentarlo' });
    }
    if (password.length < 4) {
        errors.push({ text: 'La contraseña debe ser mayor a 4 caracteres' });
    }

    if (errors.length > 0) {
        res.render('user/Registrarse', { errors, TipoUsuario, CURP, name, apellidoP, apellidoM, edad, Direccion, telefono, CVU, RFC, FNacimiento, LNacimiento, grado, matricula, email });
    }
    else {
        //A continuacion se va a buscar que el correo con el que se quiere registrar el usuario no este en uso
        const emailUser = await User.findOne({ email: email });
        if (emailUser) {
            req.flash('error_msg', ' Este correo electronico ya esta registrado');
            res.redirect('/Registrate');
        }
        const newUser = new User({ TipoUsuario, CURP, name, apellidoP, apellidoM, edad, Direccion, telefono, CVU, RFC, FNacimiento, LNacimiento, grado, matricula, email, password });
        await newUser.save();
        req.flash('success_mg', 'Usted ha sido registrado con exito')
        res.redirect('/IniciaSesion'); //pagina web direccion
    }
});

module.exports = router;

