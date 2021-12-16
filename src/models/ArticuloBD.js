const mongoose = require ('mongoose');
const {Schema} = mongoose;

const ArticuloSchema = new Schema({
    TipoDocumento:{type:String, trim:true},
    Tipo:{type:String, trim: true},
    TituloArticulo:{type: String, required:true},
    Autores: {type: String, required :true},
    LinkURL: {type: String, required: true}, 
    PDF: {type: String, required:true},
    date:{type: Date, default: Date.now}
});


// Comando para enviar a la base de datos al modelo ARTICULO ES LA COLECCION
module.exports = mongoose.model('Articulo', ArticuloSchema)  