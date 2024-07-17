const dotenv = require('dotenv');
const mongoose = require('mongoose');
//opciones que las propone la configuracion de ejemplo de mongoATLAS
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
const MONGO_LOCAL = process.env.MONGO_LOCAL;
const MONGO_ATLAS = process.env.MONGO_ATLAS;

const conexion = mongoose.connect(MONGO_ATLAS, clientOptions).then(
  () =>{
    console.log('---------------------------------------');
    console.log(`conexion a db mongo ${MONGO_ATLAS} exitosa`);
    console.log('---------------------------------------');
  },
  err => {
    console.log('---------------------------------------');
    console.log(`Error en la conexion a db mongo ${err}`);
    console.log('---------------------------------------');
  }
)
//exportamos en ES%
module.exports = conexion;




//ejemplo de la pagina de mongos ATLAS
/* const mongoose = require('mongoose');
const uri = "mongodb+srv://soporte:Axlrose2009@cluster0.mqmv3wk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect();
  }
}
run().catch(console.dir);
 */