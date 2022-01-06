const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
//const hadlebars = require('express-handlebars');
const methodOverride= require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const morgan = require ('morgan'); //CAMBIOS
const multer = require ('multer');//CAMBIOS
const uuid = require ('uuid');//CAMBIOS
//Inicializaciones 
const app = express();
require('./database');
require ('./config/passport');

//SIN diseño PERO FUNCIONA

//Configuraciones
app.set('port', process.env.PORT || 4000);
app.set("views", path.join(__dirname, "views"));
app.engine(".hbs", exphbs.engine({ 
    defaultLayout: "main", 
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",                                   
})
);

app.set('view engine', '.hbs'); 
//Middlewares, funciones ejecutadas antes de que lleguen al servidor 

app.use(morgan('dev'));//CAMBIOS
app.use(express.urlencoded({extended:false})); //para entender formularios expecificos
 const Storage = multer.diskStorage({
    destination: path.join (__dirname, 'public/pdf/uploadpdf'),
    filename: (req, file, cb, filename)=>{
        cb(null,  uuid.v4() + path.extname(file.originalname)); //ARREGLAR LO DEL UUID PARA DARLE UN ID UNICO A CADA PDF
    }
});
app.use(multer({storage: Storage}).single('PDF'));//CAMBIOS
app.use(methodOverride('_method')); //formularios envian mas metodos que GET y POST
app.use(session({
    secret: 'mysecretapp',
    resave:true,
    saveUninitialized:true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//globalvariables
app.use((req, res, next) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null ;
    next();
});

//Routes
app.use(require('./routes/index'));
app.use(require('./routes/articulos'));
app.use(require('./routes/users'));
app.use(require('./routes/admin'))
//Static Files

app.use(express.static(path.join(__dirname, 'public')));

//Start Server

app.listen(app.get('port'), ()=>{
    console.log ('Server on port', app.get('port'));
});