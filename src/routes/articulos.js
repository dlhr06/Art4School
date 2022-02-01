const express = require('express');
const router = express.Router();
const { format } = require('timeago.js');
const { unlink } = require('fs-extra');
const path = require('path');

const Articulo = require('../models/ArticuloBD');
const Usuario = require('../models/InicioSesionBD');
const { isAuthenticated } = require('../helpers/auth');

router.get('/Articulos/add', isAuthenticated, (req, res) => {
    // console.log(req.user);
    res.render('articulos/addArticulos');
});

router.post("/articulos/addNewArticulo", isAuthenticated, async (req, res) => {

    const { TipoDocumento, Tipo, TituloArticulo, Autores, LinkURL } = req.body;
    const errors = [];

    if (errors.length > 0) {
        res.render('articulos/addArticulos', {
            errors,
            TituloArticulo,
            Autor
        });
    }
    // en este ELSE SE ENVIA TODO A LA BASE DE DATOS YA QUE NO EXISTEN ERRORES 
    else {

        const newArticulo = new Articulo({ TipoDocumento, Tipo, TituloArticulo, Autores, LinkURL });
        console.log(req.user);
        newArticulo.user = req.user.id;
        newArticulo.matricula = req.user.matricula;
        newArticulo.filename = req.file.filename;
        newArticulo.path = '/pdf/uploadpdf/' + req.file.filename;
        newArticulo.originalname = req.file.originalname;
        newArticulo.mimetype = req.file.mimetype;
        // console.log(newArticulo);
        await newArticulo.save();

        req.flash('success_msg', 'Articulo añadido con exito');
        res.redirect('/Articulos') // Con esto redirecciono a otra pantalla de la pagina 
    }

});
router.get('/Articulos', isAuthenticated, async (req, res) => { //La variable FIND ARTICULOS hace que podamos mandar a llamar los atributos de cada articulo
    // console.log(req.user)
    const findArticulos = await Articulo.find({ user: req.user.id }).sort({ date: 'desc' }).lean(); //ARTICULO ES LA COLECCION DONDE SE VA A BUSCAR EL DATO
    const nombreUser = await Usuario.findById(req.user.id).lean()
    const Articulos = await Articulo.find().sort({id:'desc', date:'desc'}).lean();
    const Administradores = await Usuario.find({ "TipoUsuario": "ADMINISTRADOR" }).sort({ matricula: 'asc' }).lean();
    const EscUsuarios = await Usuario.find({ "TipoUsuario": "USUARIO" }).sort({ matricula: 'asc' }).lean();
    if (nombreUser.TipoUsuario == 'ADMINISTRADOR') {
        // res.render('admins/Reportes', { Articulos, Administradores, EscUsuarios, nombreUser});
        res.render('admins/MenuAdmin', { Articulos, Administradores, EscUsuarios, nombreUser});
    }
    if (nombreUser.TipoUsuario == 'USUARIO') { res.render('articulos/allArticulos', { findArticulos, nombreUser }); }
});
router.get('/Articulos/ViewArticulosPDF/:id', async (req, res) => {
    const viewPDF = await Articulo.findById(req.params.id).lean();
    console.log(viewPDF);
    const datePDF = format(viewPDF.date);
    res.render('articulos/ViewArticulos', { viewPDF, datePDF });
});

router.get('/Articulos/edit/:id', isAuthenticated, async (req, res) => {
    const editArticulos = await Articulo.findById(req.params.id).lean();
    if (editArticulos.user != req.user.id) {
        req.flash('error_msg', 'Not Authorized')
        return res.redirect('/Articulos');
    }
    res.render('articulos/editArticulos', { editArticulos });
});

router.put('/Articulos/editArticulos/:id', isAuthenticated, async (req, res) => {
    const { TipoDocumento, Tipo, TituloArticulo, Autores, LinkURL } = req.body;
    await Articulo.findByIdAndUpdate(req.params.id, { TipoDocumento, Tipo, TituloArticulo, Autores, LinkURL }).lean();
    res.redirect('/Articulos');  //redirect lo uso para mis direcciones web y render para un archivo de una carpeta especifica

});

router.get('/pdf/:id/editPDF', isAuthenticated, async (req, res) => {
    const editArticulos = await Articulo.findById(req.params.id).lean();
    console.log(editArticulos);
    res.render('articulos/editPDF', { editArticulos });
});

router.post("/pdf/:id/editPDF", isAuthenticated, async (req, res) => {
    const { } = req.body;

    const art = await Articulo.findById(req.params.id)
    const eliminacion = await unlink(path.resolve("./src/public" + art.path))

    art.filename = req.file.filename;
    art.path = "/pdf/uploadpdf/" + req.file.filename;
    art.originalname = req.file.originalname;
    art.mimetype = req.file.mimetype;
    await art.save();

    res.redirect("/Articulos")
})

router.put("/ChangePassword", isAuthenticated, async(req, res) => {
    const errors = [];
    const { password, ConfirmPassword } = req.body;
    console.log(req.body)
    if (password != ConfirmPassword) {
        errors.push({ text: "La contraseña no coninciden" });
    };
    if (password.length < 4) {
        errors.push({ text: "colocar una contraseña mayor a 4 digitos" });
    };
    if (errors.length > 0) {
        res.render("admin/password", { errors })
    } else {
        await Usuario.findByIdAndUpdate(req.user.id, { password });
        req.flash('sucess_msg', ' Cambio de contraseña exitoso');
        res.redirect('/Articulos');
    }

})


router.delete('/Articulos/delete/:id', isAuthenticated, async (req, res) => {
    await Articulo.findByIdAndRemove(req.params.id);
    // if (deleteArticulos.user != req.user.id) {
    //     req.flash('error_msg', 'Not Authorized')
    //     return res.redirect('/Articulos');
    // }
    res.redirect('/Articulos');
    // console.log(req.params.id)
    // res.send('OK')

});
module.exports = router;