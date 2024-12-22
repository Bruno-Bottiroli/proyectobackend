import express from "express"
import { ProductDao } from "../dao/mongoDao/products.dao.js";


const router = express.Router();


router.get('/', async (req, res) => {
    const { limit, page, sort, status, category } = req.query;
    try {
        const options= {
            limit : limit || 10,
            page: page || 1,
            sort: {
                price: sort === "asc" ? 1 : -1,
            },
            lean: true,
        }
        let filters = {};
        if (status) {
            filters.status = status === "true"
        }
        if (category) {
            filters.category = category
        }
        const products = await ProductDao.getAll(filters, options)

        res.json({ status: "ok", payload: products });
    } catch (error) {
        console.log(error);
        res.json({ status: "error", message: "An error occurred while fetching products" });
    }
});


router.post('/', async (req, res) => {
    const body = req.body;

   try {
    const product = await ProductDao.create(body)
    res.json({ status: "ok" , payload: product })
   } catch (error) {
        console.log(error)
   }
});


router.put('/:pid', async(req, res) => {
    const { pid } = req.params;
    const body = req.body
    try {
        const findproduct = await ProductDao.getById(pid)
        if(!findproduct) return res.json({status: error, message: `product id ${pid} not found` })
        const product = await ProductDao.update(pid, body)
        res.json({ status: "ok" , payload: product })
    } catch (error) {
        console.log(error)
    }
});


router.delete('/:pid', async(req, res) => {
    const { pid } = req.params;
    try {
        const findproduct = await ProductDao.getById(pid)
        if(!findproduct) return res.json({status: error, message: `product id ${pid} not found` })
        const product = await ProductDao.delete(pid)
        res.json({ status: "eliminado" , message: `product id ${pid} deleted` })
    } catch (error) {
        console.log(error)
    }
    
});


router.get('/:pid', async(req, res) => {
    const { pid } = req.params;
    try {
        const product = await ProductDao.getById(pid)
        if(!product) return res.json({status: error, message: `product id ${pid} not found` })
        res.json({ status: "ok" , payload: product })
    } catch (error) {
        console.log(error)
    }
});

export default router
