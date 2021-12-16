//Permite que cuando el usuario se autentique y guardar ese inicio de sesion

const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/UserBD');
const Admin = require('../models/AdminBD');

passport.use("IngresoUsuario",  new LocalStrategy({
    usernameField: 'email',
    passwordField: "password",
    passReqToCallback: true
},

async (req, email, password, done) =>{
   const user = await  User.findOne({email:email});
   if (!user){
       return done (null, false, {message: 'No se ha encontrado al usuario'});
   } else{
       const match = await user.matchPassword(password);
       if (match){
           return done (null, user);
       } else {
        return done (null, false, {message: 'Contraseña incorrecta'});
    }
}


}));

passport.serializeUser((user, done)=>{ //Almacena el login de un usuario especifico   que va entrar
    done (null, user.id);
});

passport.deserializeUser((id, done)=>{ //toma un ID y genera un usuario para utilizar los datos
    User.findById(id, (err, user)=>{
        done(err, user);
    });
});

passport.use("IngresoAdministrador",  new LocalStrategy({
    usernameField: 'email',
    passwordField: "password",
    passReqToCallback: true
},

async (req,email, password, done) =>{
   const userAdmin = await  Admin.findOne({email:email}); //cambiar el email despues
   if (!userAdmin){
       return done (null, false, {message: 'Administrador no encontrado'});
   } else{
       const match = await userAdmin.matchPassword(password);
       if (match){
           return done (null, userAdmin);
       } else {
        return done (null, false, {message: 'Contraseña incorrecta'});
    }
}


}));

passport.serializeUser((userAdmin, done)=>{ //Almacena el login de un usuario especifico   que va entrar
    done (null, userAdmin.id);
});

passport.deserializeUser((id, done)=>{ //toma un ID y genera un usuario para utilizar los datos
    Admin.findById(id, (err, userAdmin)=>{
        done(err, userAdmin);
    });
});