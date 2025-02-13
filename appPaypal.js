require('dotenv').config();
const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const multer = require('multer');
const paypal = require('@paypal/checkout-server-sdk')
const Producto = require ('./models/productos')

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => app.listen(PORT, () => console.log(`SERVIDOR CONECTADO A https://localhost:${PORT}`)))
    .catch((error) => console.log(error));

app.set('view engine','ejs');
app.set('views','html2');

app.use(express.static('public'))
app.use('/uploads',express.static('uploads'))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('method'))
app.use(session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: true,
    cookie: {secure:false}
}))

const Environment = paypal.core.SandboxEnvironment;
const PaypalClient = new paypal.core.PayPalHttpClient(new Environment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
));

//-vistas-////////////////////////////////////////////////////////////////

app.get('/productos' , async(req,res)=>{
    try{
        const productos = await Producto.find().sort({createdAt: -1})
        const cesta = req.session.cesta || []
        const cestaCantidad = cesta.reduce((total,item) => total + item.cantidad,0)
        res.render('productos',{ productos,cestaCantidad})
    } catch(error){
        console.error('error al obetener los datos', error)
        res.status(500).send('error al cargar los datos')
    }
})

app.post('/add-to-cart', async (req,res) => {
    const {productoId, cantidad} = req.body
    const cantidadInt = parseInt(cantidad,10)
    const producto = await Producto.findById(productoId)
    if(!producto) return res.status(404).send("producto no encontrado")
    req.session.cesta= req.session.cesta || [] //nos guarda las cantidades en nuestra session
    const productoExistente = req.session.cesta.find(item => item.productoId == productoId)
    if(productoExistente){
        productoExistente.cantidad+=cantidadInt
    } else {
        req.session.cesta.push({
            productoId,
            nombre: producto.nombre,
            precio: producto.precio,
            imagenUrl: producto.imagenUrl,
            cantidad: cantidadInt
        })
    }
    req.session.save(err => err ? res.status(500).send("error al actualizar la cesta"): res.redirect('/productos'))
})

app.get('/cesta', async (req,res) =>{
    res.render('cesta',{cesta: req.session.cesta || []})
})



