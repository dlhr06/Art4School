const mongoose = require('mongoose');
const { Schema } = mongoose;

const ArticuloSchema = new Schema({
    TipoDocumento: { type: String, trim: true },
    Tipo: { type: String, trim: true },
    TituloArticulo: { type: String, required: true },
    Autores: { type: String, required: true },
    LinkURL: { type: String, required: true },
    filename: { type: String },
    path: { type: String },
    originalname: { type: String },
    user:{ type:String, required:true},
    matricula: {type:String, trim:true},
    mimetype:{type:String, required:true},
    tipestamp: { type: Date, default: Date.now },
    date: { type: Date, default: Date.now }
});
 

ArticuloSchema.virtual('uniqueId')
    .get(function () {
        return this.filename.replace(path.extname(this.filename), '') 
    });

// Comando para enviar a la base de datos al modelo ARTICULO ES LA COLECCION
module.exports = mongoose.model('Articulo', ArticuloSchema)  