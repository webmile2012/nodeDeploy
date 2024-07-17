const mongoose = require('mongoose');
const { Schema } = mongoose;

const productEsquema = new Schema({
  nombre: {
    type: String,
    require: true
  },
  precio: {
    type: Number,
    require: true,
},
  imagen: {
    type: String,
    require: false
},
descripcion: {
    type: String,
    require: true
},
date: {   
    type: Date, 
    default: new Date() //guardamos la fecha del momento formato legible
},
});
//exportamos el esquema con nombre y su configuracion: userEsquema (esto lo tomaria controlles
module.exports = mongoose.model('Product', productEsquema);//siempre en plural Product y cuando se cree mongodb la coleccion se llamara Products