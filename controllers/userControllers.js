//importo request y responde de express porque no lo tengo
const { request, response} = require('express');

//funcion que obtiene los resultados de los chequeos de los campos que estan en UserRouter--> const {check} = require('express-validator');
const {validationResult} = require('express-validator');

//traemos el modelo esquema para cuando creemos 
const User = require('../models/userModel');

//libreria para encriptar y desencriptar contraseñas
const bcrypt = require('bcrypt');

//libreria para JSON WEB TOKEN
const jwt = require('jsonwebtoken');

//libreria recuperar variables entorno
const dotenv = require('dotenv');
dotenv.config();

const enviarMail = require('../servicios/enviarEmail');

//funcion llamada desde /user
const dameUsuarios = async (req = request, res = response) =>
    {
        //res.render('index');
        //res.send(`<h1>Te doy los usuarios</h1>`)
        const usuarios = await User.find({});
        console.log('------------lista de usuarios-----------------------');
        console.log(usuarios);
        res.render('userList', {Todosusuarios: usuarios});
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

const loginUsuario = async(req = request, res = response) =>
    {
        const validar = validationResult(req);
        console.log('-------validar------------------------------------')
        console.log(validar);
        if(!validar.isEmpty())
            {
                return res.render('error', {error: 'Mail o usuario no cumple con requisitos'})
            }
        const {txtMail, txtPassword} = req.body;
        try {
        const usuarioExiste = await User.findOne({mailok: txtMail});
        //console.log(usuarioExiste);
        if(!usuarioExiste)
            {
                //console.log('-----------txtmail y nombre----------')
                return res.render('form', {mail: txtMail, nombre: null})
            }
        else
            {
                //console.log(txtPassword);
                //console.log(User.passok);
                const checkPass = await bcrypt.compare(txtPassword, usuarioExiste.passok)
                if(!checkPass)
                    {
                        return res.render('error', {error: "Contraseña incorrecta"})
                    }
                else
                {
                    const mifirmaSecreta = process.env.JWT_SECRET;
                    const token = jwt.sign({nombre:usuarioExiste.nombreok},
                        mifirmaSecreta, {expiresIn: '1h'})
                        res.header('auth-token', token).render('product');
                       //res.header('auth-token', token).render('form', {mail: '', nombre:usuarioExiste.mailok, nombre: ""});
                    //return res.render('product')
                }
            }    
        } catch (error) {
            const err = 'Error en Login usuarios ' + error;
            return res.render('error', { error: err})
        }
    }

//una vez que quisieran crear un usuario recibido con POST(probado con POSTMAN), recibimos en el body y lo responodemos para saber que se creo 
const crearNuevoUsuario = async (req = request, res = response) => 
{
    const validar = validationResult(req);
    if(!validar.isEmpty())
        {
            return res.render('error', {error: 'Algunos datos no se cargaron correctamente'})
            //si no da error sigue al try que graba el usuario sabe()
        }
    const {nombreok,apellidook,mailok,passok} = req.body;

    //validamos si el usuario existe
    const usuarioExiste = await User.findOne({mailok: mailok});
    console.log("---------------usuario existe----------");
    console.log(usuarioExiste);
    if(usuarioExiste){
        return res.render('error', {
            error: 'El usuario ya existe'
        })
    }
    //FORMA 1 recupero desde el body el campo enviado por post
    //const nombreok = req.body.nombreok; 
    //const apellidook = req.body.apellidook;
    //const mailok = req.body.mailok;
    //const passok = req.body.passok;

    //const passok = Number(req.body.passok); //con esta funcion pasamos un campos del body a numerico YA QUE SIEMPRE LOS INPUT SON STRING
    //const passok = parseInt(req.body.txtPasword);
    //FORMA 2 recupero todo el body y adentro de este estan los campos txtNombre,txtApellido,etc
    //const usuario  = req.body;
    //Generalmos la Salt para encriptar la contraseña, esto se le suma al resultado del password encriptado
    
    //FORMA 3 creo un objeto con las propiedades 
    const persona = {
        nombreok : nombreok,
        mailok   : mailok,
        passok   : passok
    }
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
    //const user = new User(usuario);
    
    
    try 
    {
        const salt = await bcrypt.genSalt(10);
        persona.passok = await bcrypt.hash(passok,salt);
        const user = new User(persona);
        const userCreado = await user.save(); //no continua a la linea de abajo hasta que save() sea resuelto
        //enviamos un mail usando nodemailer
        enviarMail(nombreok,mailok)
        .then(()=>console.log("mail enviado!"))
        .catch((err)=> console.log("no se pudo enviar el correo")) ;
        if(userCreado)
            {
                return res.render('login');
            }else
            {
                return res.render('error', {error: "No se pudo crear el usuario"})
            }
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
    loginUsuario,
    crearNuevoUsuario,
    borrarUsuario,
    modificarUsuario,
    dameFormulario
};
