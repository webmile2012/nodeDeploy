const {request, response} = require('express');

const Product = require('../models/productModel');

const {validationResult} = require('express-validator');

const dameProduct = async (req = request, res = response) =>{
    try {
        const productos = await Product.find({});
        console.log('-------------consulta productos----------------');
        console.log(productos);
        res.render('productList', {TodosProductos: productos});
    } catch (error) {
        res.render('error', {error: 'Error en consulta de productos ' + error}); 
    }
    
}

const cardsProduct = async (req = request, res = response) =>{
    try {
        const productos = await Product.find({});
        res.render('cardsProducts', {TodosProductos: productos});
    } catch (error) {
        res.render('error', {error: 'Error en consulta de productos ' + error}); 
    }
    
}

const selectProducto = async (req = request, res = response) =>{
    //const { idProducto } = req.body;
    const idProducto = req.params._id;
    try {
        const leeProducto = await Product.findOne({_id: idProducto});
        //const producto = await Product.findById({idProducto});

        const producto = {
            nombreProducto: leeProducto.nombre,
            descripcionProducto: leeProducto.descripcion,
            imagenProducto: leeProducto.imagen,
            precioProducto: leeProducto.precio
        }
        res.render('selecProducts', producto)
    } catch (error) {
        res.render('error', {error: "Ocurrio un error en selectProducto" + error});
    } 
}

const crearProducto = (req = request, res = response) =>{
    const validar = validationResult(req);
    if(!validar.isEmpty())
        {
            return res.render('error', {error: 'Algunos se cargaron de forma incorrecta'})
        }

    const campos = req.body;
    try 
    {
        const objProductos = new Product(campos);
        objProductos.save();
        //return res.render('product');
        return res.send('productos grabados');
    } 
    catch (error) 
    {
        return res.render('error');
    }
}

module.exports = {dameProduct, cardsProduct, crearProducto, selectProducto};