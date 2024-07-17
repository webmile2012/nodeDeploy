//librerias
const express = require ('express');
const app = express();
const morgan = require('morgan'); //libreria para saber rutaas donde esta nuestra app
const userRouter = require('./router/userRouter');
const productRouter = require('./router/productRouter');
//obtengo path de la libreria del motor de node
const path = require('node:path');

const hbs = require('hbs');
//configuramos hbs HANDLEBARS
app.set('view engine', 'hbs'); //la ingenieria de vistas esta a cargo de HBS.. tambien podemos usar pug ejs, etc.
app.set('views', './views'); //los archivos de vistas estan en ese directorio
//registramos los partials(footer y navegation) para que layout los encuentre
hbs.registerPartials(__dirname + '/views/partials');
//express middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev')); //modo dev muestra la ruta y estatus ej 200ok
//configuramos la carpete de css, imagenes, etc .. despues podemos hacer referencia desde public/ en adelante
app.use(express.static(path.join(__dirname + '/public')));

//rutas
app.use('/user', userRouter);
//esto es lo mismo que arriba solo que lo importo directamente aca
//app.use('/product', require('./router/userRouter'));

console.log(new Date()); //formato fecha visible
console.log(Date.now()); //devuelte dia actual pero en milisegundos

app.use('/product', productRouter);

app.get('/', (req,res) => {
    res.render('index')
});
//para cuando no matchea con ninguna ruta cae en esta por defecto y muestro error.
app.get('*', (req, res) => {
    res.render('error', {
        error: 'cuatrocientos cuatro '
    });
})

module.exports = app;