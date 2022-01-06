const mongoose = require ('mongoose');
const {Schema} = mongoose;
   // cambiar los datos de BD conforme al administrador 
const InicioSchema = new Schema({
    TipoUsuario: {type:String, trim:true},
    CURP: {type: String, trim: true}, 
    name: { type: String, trim: true },
    apellidoP: { type: String, trim: true },
    apellidoM: { type: String, trim: true },
    edad:{type: Number, trim:true},
    Direccion: {type: String, trim: true},
    telefono:{type: Number, trim:true},
    CVU: {type:String, trim:true},
    RFC:{type:String, trim:true},
    FNacimiento: { type: Date, trim: true },
    LugarNacimiento:{type:String, trim:true},
    grado:{type:String, trim: true},
    matricula: { type: String, trim: true, required:true, unique:true},
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now },
   }); 

module.exports = mongoose.model('Usuario', InicioSchema); 

