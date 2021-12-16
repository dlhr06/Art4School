const express = require ('express');
const router = express.Router();

const Articulo = require('../models/ArticuloBD');
const{ isAuthenticated} = require('../helpers/auth');


router.get('/Articulos/add', isAuthenticated,   (req,res)=>{
    res.render('articulos/addArticulos'); 
});

router.post("/articulos/addNewArticulo", isAuthenticated, async (req,res)=>{
const {TipoDocumento,Tipo, TituloArticulo, Autores,  LinkURL, PDF,}= req.body;
const errors=[];

if (errors.length >0){
    res.render('articulos/addArticulos', {
        errors, 
        TituloArticulo,
        Autor
    });
}
    // en este ELSE SE ENVIA TODO A LA BASE DE DATOS YA QUE NO EXISTEN ERRORES 
    else {
        const newArticulo = new Articulo({TipoDocumento, Tipo, TituloArticulo, Autores,  LinkURL, PDF});
        await newArticulo.save();
        req.flash('success_msg', 'Articulo añadido con exito'); 

        res.redirect('/Articulos') // Con esto redirecciono a otra pantalla de la pagina 
    } 

});
    router.get ('/Articulos', isAuthenticated, async (req,res) =>{ //La variable FIND ARTICULOS hace que podamos mandar a llamar los atributos de cada articulo
    const findArticulos = await Articulo.find().sort({date: 'desc'}).lean(); //ARTICULO ES LA COLECCION DONDE SE VA A BUSCAR EL DATO
    res.render('articulos/allArticulos', {findArticulos});
   
});

router.get('/Articulos/edit/:id', isAuthenticated, async (req,res)=>{
    const editArticulos = await Articulo.findById(req.params.id).lean();
    res.render('articulos/editArticulos', {editArticulos});
   
});

router.put('/Articulos/editArticulos/:id', isAuthenticated, async (req,res)=>{
    const {TipoDocumento, Tipo,  TituloArticulo, Autores,  LinkURL, PDF}= req.body;
    await Articulo.findByIdAndUpdate(req.params.id, {TipoDocumento, Tipo,  TituloArticulo, Autores,  LinkURL, PDF});
    res.redirect('/Articulos');  //redirect lo uso para mis direcciones web y render para un archivo de una carpeta especifica
  
})

router.delete('/Articulos/delete/:id', isAuthenticated ,async(req, res)=>{
    await Articulo.findByIdAndRemove(req.params.id);
    res.redirect('/Articulos');
    // console.log(req.params.id)
    // res.send('OK')

});
module.exports = router;