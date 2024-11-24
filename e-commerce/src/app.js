const express = require('express');
const app = express();


const productRoutes = require('./routes/products.routes.js');
const cartRoutes = require('./routes/carts.routes.js');


app.use(express.json());
app.use(express.urlencoded({extended: true}))


app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);


const PORT = 8080;
app.listen(8080, () => {
  console.log(`Server is running on port ${PORT}`);
});
