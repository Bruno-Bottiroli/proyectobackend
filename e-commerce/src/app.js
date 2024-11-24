const express = require('express');
const app = express();

// Importar las rutas de productos y carritos
const productRoutes = require('./routes/products.routes.js');
const cartRoutes = require('./routes/carts.routes.js');

// Middleware para manejar JSON
app.use(express.json());

// Usar las rutas
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

// Puerto de escucha
const PORT = 8080;
app.listen(8080, () => {
  console.log(`Server is running on port ${PORT}`);
});
