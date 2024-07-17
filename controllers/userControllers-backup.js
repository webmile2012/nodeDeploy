//importo request y responde de express porque no lo tengo
const { request, response} = require('express');

//funcion que obtiene los resultados de los chequeos de los campos que estan en UserRouter--> const {check} = require('express-validator');

const {validationResult} = require('express-validator');

//traemos el modelo esquema para cuando creemos 
const User = require('../models/userModel');

//libreria para encriptar y desencriptar contraseñas
const bycrypt = require('bcrypt');

//funcion llamada desde /user
const dameUsuarios = (req = request, res = response) =>
    {
        //res.render('index');
        res.send(`<h1>Te doy los usuarios</h1>`)
    }
    //{res.json({Users: 'Envio la lista de usuarios Dameusuarios'})}
const dameFormulario = (req = request, res = response) => 
    {
        res.render('form');
    }
const dameLogin = (req = request, res = response) => 
    {
        res.render('login');
    }

//una vez que quisieran crear un usuario recibido con POST(probado con POSTMAN), recibimos en el body y lo responodemos para saber que se creo 
const crearNuevoUsuario = async (req = request, res = response) => 
{
    const validar = validationResult(req);
    console.log(validar);
    if(!validar.isEmpty())
        {
            return res.render('error', {error: 'Algunos datos no se cargaron correctamente'})
            //si no da error sigue al try que graba el usuario sabe()
        }
        
    //FORMA 1 recupero desde el body el campo enviado por post
    //const nombreok = req.body.txtNombre; 
    //const apellidook = req.body.txtApellido;
    //const mailok = req.body.txtMail;
    //const passok = Number(req.body.txtPassword); //con esta funcion pasamos un campos del body a numerico YA QUE SIEMPRE LOS INPUT SON STRING
    //const passok = parseInt(req.body.txtPasword);
    
    //Desestructuro los campos directamente del body
    //const {nombreok,apellidook,mailok,passok} = req.body;

    //FORMA 2 recupero todo el body y adentro de este estan los campos txtNombre,txtApellido,etc
    const usuario  = req.body;
    //Generalmos la Salt para encriptar la contraseña, esto se le suma al resultado del password encriptado
    const salt = await bycrypt.genSalt(10);
    
    console.log("salt: " + salt);

    //FORMA 3 creo un objeto con las propiedades 
    //const persona = {
    //    pNombre : nombreok,
    //    pMail : mailok,
    //    pPass : passok
    //}
    //FORMA 4  desestructuro los campos desde el body
    //const {nombreok, apellidook, mailok, passok} = req.body;

    //console.log(nombreok,mailok,passok);
    //diferentes formas de instanciar el modelo 
    //const user = new User(); //instanciamos un usuario y trae todas las prop 
    //const user = new User(nombreok,mailok,passok);
    //const user = new User(req.body); 
    //const user = new User(persona);
    //------------------guardamos en DB FORMA 1-----------------
    // const user = new User(usuario);
    // try 
    // {
    //     user.save();
    //     res.render('resForm', {
    //         nom: nombreok,
    //         mail: mailok,
    //         password: passok
    //      })
    // } 
    // catch (error) 
    // {
    //     console.log(error)
    //     return res.render('error', {
    //         error: error
    //     })
    // }
    //---------guardamos en DB FORMA 2 SYNC AWAY para esto agregamos ASYNC a crearNuevoUsuario-----------------
    const user = new User(usuario);
    console.log('------------------------------------------');
    console.log(user.nombreok);
    console.log(user.mailok);
    console.log(user.passok);
    console.log(user.date);
    
    try 
    {
        //await user.save(); //no continua a la linea de abajo hasta que save() sea resuelto

        return res.render('login');
    } 
    catch (error)
    {
        const err = 'tenemos un problema en la creacion de usuarios';
        return res.render('error', {
            error:error
        })
    }

    //console.log(req.url + " " + usuario);
    //traigo datos del form desestructurado del body
    //const {txtNombre,txtApellido} = req.body;
    //console.log(txtNombre + " " + txtApellido);
    //res.json({users: usuario});
}
//borrar un usuario
const borrarUsuario = (req= request, res=response) => {
    res.json({eliminados: "datos eliminados"})
}
//modificar
const modificarUsuario = (req=request,res=response) =>{
    res.json({actualizado: "datos actualizados"})
}

//exportamos la funcion para tomarla de userRouter.js
module.exports = {
    dameUsuarios,
    dameLogin,
    crearNuevoUsuario,
    borrarUsuario,
    modificarUsuario,
    dameFormulario
};
