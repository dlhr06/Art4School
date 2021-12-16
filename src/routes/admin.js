const express = require ('express');
const router = express.Router();
const Admin = require('../models/AdminBD');
const passport= require('passport');

router.get('/IniciaSesionAdmin', (req,res) => { //Iniciar sesion como administador
    res.render('user/administrador');
});

router.post('/user/administrador', passport.authenticate("IngresoAdministrador", {
    successRedirect: '/ViewArticulosAdmin', //AQUI SI ENTRA
    failureRedirect: '/IniciaSesionAdmin', 
    failureFlash: true
}));

router.get('/ViewArticulosAdmin', (req,res)=> { //REGISTRARSE PARA INICIAR SESION
    res.render('articulos/viewArticulos')
});



router.get('/RegistrarAdministrador', (req,res)=> { //REGISTRARSE PARA INICIAR SESION
    res.render('user/RegistrarAdmin')
});

router.post('/user/RegistrarAdmin',  async (req,res)=>{
    const {CURP, name, apellidoP, apellidoM, telefono, matricula,  email, password, cpassword} = req.body;
    const errors=[];
   
    if (password != cpassword){
        errors.push({text: 'La contraseña no coincide, vuelva a intentarlo'});
    }
    if (password.length < 4){
        errors.push({text: 'La contraseña debe ser mayor a 4 caracteres'});
    }

    if (errors.length >0){
        res.render('user/RegistrarAdmin', {errors, CURP, name, apellidoP, apellidoM, telefono, matricula, email});
    }
    else{
        //A continuacion se va a buscar que el correo con el que se quiere registrar el usuario no este en uso
        const adminUser = await Admin.findOne({email: email});
        if(adminUser){
            req.flash('error_msg', ' Este correo electronico ya esta registrado');
            res.redirect('/RegistrarAdministrador');
        }
        const newAdmin = new Admin({CURP, name, apellidoP, apellidoM, telefono, matricula,  email, password});
        newAdmin.password = await newAdmin.encryptPassword(password);
        await newAdmin.save();
        req.flash('success_mg', 'Usted ha sido registrado con exito')
        res.redirect('/'); //pagina web direccion del administrador 
    }

});

router.get('/Logout', (req, res) => {
    req.logOut();
    res.redirect('/');

});

module.exports = router;

 