// app.js

const express = require('express');
const app = express();


const productRoutes = require('./Routes/ProductRoutes'); 
const cartRoutes = require('./Routes/cartRoutes'); 

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

// Configurar el puerto
const PORT = 8060;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
