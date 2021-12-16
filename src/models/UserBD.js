const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcryptjs');

// const UserSchema = new Schema({
//         name: { type: String, trim: true },
//         apellidoP: { type: String, trim: true },
//         apellidoM: { type: String, trim: true },
//         matricula: { type: String, trim: true, required:true, unique:true},
//         FNacimiento: { type: Date, trim: true },
//         Grado: { type: String, trim: true },
//         carrera: { type: String, trim: true },
//         email: { type: String, required: true, unique: true, trim: true },
//         password: { type: String, required: true },
//         date: { type: Date, default: Date.now },
// });

const UserSchema = new Schema({
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
UserSchema.methods.encryptPassword =async(password) =>{
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, salt);
    return hash;
}

UserSchema.methods.matchPassword = async function (password){
    return await bcrypt.compare(password, this.password);
};
module.exports = mongoose.model('User', UserSchema); 

