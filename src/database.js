//PARA LA CONEXION A LA BASE DE DATOS 
 const mongoose = require ('mongoose');

 mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://dlhrbd:articulosbditsm@articulosbd.dzrrf.mongodb.net/ArticulosBD?retryWrites=true&w=majority") 
 .then(db => console.log('DB is connected'))
 .catch(err=> console.error(err));