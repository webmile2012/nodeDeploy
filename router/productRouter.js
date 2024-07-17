const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const {dameProduct, cardsProduct, crearProducto, selectProducto} = require('../controllers/productController');

router.get('/formProduct', dameProduct);

router.get('/cards', cardsProduct);

router.post('/form', 
            [check("nombre").isString().isLength({min: 3}),
             check("precio").isNumeric(),
             check("imagen").isString(),
             check("descripcion").isString()
            ],
            crearProducto);

//router.post('/unProducto', selectProducto);
router.get('/unProducto/:_id', selectProducto);

module.exports = router; 