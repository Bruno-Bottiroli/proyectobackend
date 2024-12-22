import express from "express"
import fs from "fs"
import { cartModel } from "../dao/models/cart.model.js"
import { ProductDao } from "../dao/mongoDao/products.dao.js"
import { CartDao } from "../dao/mongoDao/carts.dao.js"
const router = express.Router();

//vestigios del filesystem jaja
const readCarts = () => {
    const data = fs.readFileSync('./src/data/carts.json', 'utf-8')
    return JSON.parse(data)
};


const writeCarts = (carts) => {
    fs.writeFileSync('./src/data/carts.json', JSON.stringify(carts, null, 2));
};


router.post('/', async (req, res) => {

    try {
        const carts = await CartDao.create({})
        res.json({ status: "ok", payload: carts })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "error", message: error.message })
    }

});


router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await CartDao.getById(cid)
        if (!cart) return res.json({ status: "error", message: `cart id ${cid} not found` });
        res.json({ status: "ok", payload: cart });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", message: error.message });
    }
});


router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params

    try {
        const updatedCart = await CartDao.addProduct(cid, pid)

        res.json({ status: "ok", payload: updatedCart })
    } catch (error) {
        console.error(error)
        res.status(500).json({ status: "error", message: error.message })
    }
});


router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params
    try {
        
        const product = await ProductDao.getById(pid)
        if(!product) return res.json({status: "error", message: `product id ${pid} not found` })

        const cart = await CartDao.getById(cid)
        if(!cart) return res.json({ status: "error", message: `cart id ${cid} not found` })
        
        const cartUpdated = await CartDao.deleteProductInCart(cid, pid)

        res.json({status: "ok", payload: cartUpdated})
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "error", message: error.message })
    }

}) 

router.put("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params
    const { quantity } = req.body

    try {
        const updatedCart = await CartDao.updateProductInCart(cid, pid, quantity)
        res.json({ status: "ok", payload: updatedCart })
    } catch (error) {
        console.error(error)
        res.status(500).json({ status: "error", message: error.message })
    }
});

router.delete("/:cid", async (req, res) => {
    const {cid} = req.params

    try {
        const cart = await cartModel.findById(cid)
        if(!cart) return res.json({ status: "error", message: `cart id ${cid} not found` })

        const cartUpdated= await CartDao.deleteProductsInCart(cid)

        res.json({status: "ok", payload: cartUpdated})
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "error", message: error.message })
    }
})

export default router
