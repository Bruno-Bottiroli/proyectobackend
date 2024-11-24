const express = require('express');
const fs = require('fs');
const router = express.Router();

// Leer archivo JSON
const readCarts = () => {
    const data = fs.readFileSync('./src/data/carts.json', 'utf-8');
    return JSON.parse(data);
};

// Guardar archivo JSON
const writeCarts = (carts) => {
    fs.writeFileSync('./src/data/carts.json', JSON.stringify(carts, null, 2));
};

// Crear un nuevo carrito
router.post('/', (req, res) => {
    const carts = readCarts();
    const newCart = {
        id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1,
        products: []
    };

    carts.push(newCart);
    writeCarts(carts);
    res.status(201).json(newCart);
});

// Obtener los productos de un carrito
router.get('/:cid', (req, res) => {
    const { cid } = req.params;
    const carts = readCarts();
    const cart = carts.find(c => c.id === parseInt(cid));

    if (!cart) {
        return res.status(404).send('Carrito no encontrado');
    }

    res.json(cart.products);
});

// Agregar un producto a un carrito
router.post('/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;

    const carts = readCarts();
    const cart = carts.find(c => c.id === parseInt(cid));

    if (!cart) {
        return res.status(404).send('Carrito no encontrado');
    }

    const product = { product: pid, quantity };
    const productInCart = cart.products.find(p => p.product === pid);

    if (productInCart) {
        productInCart.quantity += quantity;  // Incrementa la cantidad si ya existe
    } else {
        cart.products.push(product);
    }

    writeCarts(carts);
    res.status(201).json(product);
});

module.exports = router;
