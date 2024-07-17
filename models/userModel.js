//la estructura que permite mongoose para que el usuario guarde los datos
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userEsquema = new Schema({
  nombreok: {
    type: String,
    require: true
  },
  mailok: {
    type: String,
    require: true,
    unique : true //para que el mismo distintos usuarios quieran insertar datos con mismo mail
},
  passok: {
    type: String,
    require: true
},
  date: { 
    type: Date, 
    default: new Date() //guardamos la fecha del momento formato legible
},
});
//exportamos el esquema con nombre y su configuracion: userEsquema (esto lo tomaria controllers para crearUsuarios)
module.exports = mongoose.model('User', userEsquema);//siempre en plural User y cuando se cree mongodb la coleccion se llamara users