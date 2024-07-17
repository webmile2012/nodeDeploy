const express = require('express');
const router  = express.Router();
//tomo desestructurado la funcion exportada en userController
const {loginUsuario, dameUsuarios, crearNuevoUsuario, borrarUsuario, modificarUsuario, dameFormulario, dameLogin} = require('../controllers/userControllers');
//desestructuramos la funcion para chequear los campos desde el BACKEND .. check , body y query sirven para lo mismo
const {check, body, query} = require('express-validator');
 
//respondo /user pero la funcion esta en controllers/userController.js
router.get('/', dameUsuarios); 
//igual que anterior pero ejecutando la funcion aca
//router.get('/', (req, res) => {
//});

router.get('/form', dameFormulario);

router.get('/formLogin', dameLogin);

router.post('/login', 
        [check("txtMail").isString().isLength({min: 3}).isEmail(),
         check("txtPassword").isLength({min: 8})
        ],
        loginUsuario);

router.delete('/', borrarUsuario);

router.post('/form',
           [check("nombreok").isString().isLength({min: 3}),
            check("mailok").isEmail(),
            check("passok").isString().isLength({min: 6}).isAlphanumeric()
           ],
           crearNuevoUsuario);

//crear array de usuarios para responder a /user/all
//respondo direxctamente aca sin llamar a funcion, para tener un ej.
let user = {id:1, name: 'Miguel', email:'macuna@cpmgsa.com.ar'};
router.get('/all', (req, res) => {
    res.json({user})
});

router.put('/', modificarUsuario);

//console.log("estoyn dentro del ruteo");

module.exports = router;