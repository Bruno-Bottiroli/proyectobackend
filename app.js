import express from "express";
import { connectMongoDB } from "./src/config/mongoDb.config.js";
import cartRoutes from "./src/router/carts.routes.js";
import productRoutes from "./src/router/products.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

connectMongoDB()
const PORT = 8080;
app.listen(8080, () => {
  console.log(`servidor andando en puerto :  ${PORT}`);
});
