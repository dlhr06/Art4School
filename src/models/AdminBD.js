const mongoose = require ('mongoose');
const {Schema} = mongoose;
const bcrypt = require ('bcryptjs'); 
   // cambiar los datos de BD conforme al administrador 
const AdminSchema = new Schema({
    CURP:           { type: String, trim: true}, 
    name:           { type: String, trim: true },
    apellidoP:      { type: String, trim: true },
    apellidoM:      { type: String, trim: true },
    telefono:       { type: Number, trim:true},
    matricula:      { type: String, trim: true, required:true, unique:true},
    email:          { type: String, required: true, unique: true, trim: true },
    password:       { type: String, required: true },
    date:           { type: Date, default: Date.now }
   }); 

AdminSchema.methods.encryptPassword =async(password) =>{
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, salt);
    return hash;
}

AdminSchema.methods.matchPassword = async function (password){
    return await bcrypt.compare(password, this.password);
};
module.exports = mongoose.model('Admin', AdminSchema); 

