import express from "express"
import fs from "fs"
const router = express.Router();


const readCarts = () => {
    const data = fs.readFileSync('./src/data/carts.json', 'utf-8');
    return JSON.parse(data);
};


const writeCarts = (carts) => {
    fs.writeFileSync('./src/data/carts.json', JSON.stringify(carts, null, 2));
};


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


router.get('/:cid', (req, res) => {
    const { cid } = req.params;
    const carts = readCarts();
    const cart = carts.find(c => c.id === parseInt(cid));

    if (!cart) {
        return res.status(404).send('Carrito no encontrado');
    }

    res.json(cart.products);
});


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
        productInCart.quantity += quantity;  
    } else {
        cart.products.push(product);
    }

    writeCarts(carts);
    res.status(201).json(product);
});

export default router
