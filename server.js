const dotenv = require('dotenv'); 
dotenv.config();
const PORT = process.env.PORT || 9000; 
const app = require('./index');
//llamo a la conexion mongodb
const conexion = require('./databases/conexion');
app.listen(PORT, () => {
    console.log(`Escuchando App port http://localhost:${PORT}`)
})