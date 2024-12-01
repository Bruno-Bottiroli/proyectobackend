import express from "express"
import fs from "fs"

const router = express.Router();


const readProducts = () => {
    const data = fs.readFileSync('./src/data/products.json', 'utf-8');
    return JSON.parse(data);
};


const writeProducts = (products) => {
    fs.writeFileSync('./src/data/products.json', JSON.stringify(products, null, 2));
};


router.get('/', (req, res) => {
    const { limit } = req.query;
    const products = readProducts();
    if (limit) {
        return res.json(products.slice(0, parseInt(limit)));
    }
    res.json(products);
});


router.post('/', (req, res) => {
    const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;

    if (!title || !description || !code || !price || stock == null || !category) {
        return res.status(400).send('Todos los campos son obligatorios, excepto thumbnails');
    }

    const products = readProducts();
    const newProduct = {
        id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
    };

    products.push(newProduct);
    writeProducts(products);
    res.status(201).json(newProduct);
});


router.put('/:pid', (req, res) => {
    const { pid } = req.params;
    const { title, description, code, price, status, stock, category, thumbnails = [] } = req.body;

    if (!title || !description || !code || !price || stock == null || !category) {
        return res.status(400).send('Todos los campos son obligatorios, excepto thumbnails');
    }

    const products = readProducts();
    const productIndex = products.findIndex(product => product.id === parseInt(pid));

    if (productIndex === -1) {
        return res.status(404).send('Producto no encontrado');
    }

    
    const updatedProduct = {
        ...products[productIndex],
        title,
        description,
        code,
        price,
        status: status !== undefined ? status : products[productIndex].status,
        stock,
        category,
        thumbnails
    };

    products[productIndex] = updatedProduct;
    writeProducts(products);

    res.json(updatedProduct);
});


router.delete('/:pid', (req, res) => {
    const { pid } = req.params;

    const products = readProducts();
    const productIndex = products.findIndex(product => product.id === parseInt(pid));

    if (productIndex === -1) {
        return res.status(404).send('Producto no encontrado');
    }

    products.splice(productIndex, 1);
    writeProducts(products);

    res.status(200).send('Producto eliminado');
});


router.get('/:pid', (req, res) => {
    const { pid } = req.params;

    const products = readProducts();
    const product = products.find(p => p.id === parseInt(pid));

    if (!product) {
        return res.status(404).send('Producto no encontrado');
    }

    res.json(product);
});

export default router
