import express from "express"

const app = express();

import cartRoutes from "./src/router/carts.routes.js"
import productRoutes from "./src/router/products.routes.js"


app.use(express.json());
app.use(express.urlencoded({extended: true}))


app.use('/products', productRoutes);
app.use('/carts', cartRoutes);


const PORT = 8080;
app.listen(8080, () => {
  console.log(`servidor andando en puerto :  ${PORT}`);
});
