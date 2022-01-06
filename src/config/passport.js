const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/InicioSesionBD');

passport.use("IngresoUsuario",new LocalStrategy(
    {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
    },
    async (req, email, password, done) => {
        const user = await User.findOne({ email: email });
        if (user ) {
            const contrasena = await User.findOne({ email: email, password: password});
            if(contrasena){
                const userfinal = await User.findOne({email:email, password:password, TipoUsuario:req.body.TipoUsuario});
                if (userfinal){
                    return done (null, userfinal)
                }
                else {return done (null, false, {message: "Usuario Incorrecto"})}
            }
            else{ return done(null, false, { message: "Contraseña Incorrecta" }); }
        } 
        else {  return done(null, false, { message: "Usuario no encontrado" }); }
}));

passport.serializeUser(
    (user, done) => {
        done(null, user.id);
    });
passport.deserializeUser(
    (id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)});});