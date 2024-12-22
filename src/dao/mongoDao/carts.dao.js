import { cartModel } from "../models/cart.model.js";
import { productModel } from "../models/product.model.js";

class cartDao{
    async getAll(){
        return await cartModel.find()
    }

    async getById(id){
        return await cartModel.findById(id).lean(false)
    }
    
    async create(data){
        return await cartModel.create(data)
    }

    async update(id, data){
        return await cartModel.findByIdAndUpdate(id, data, {new: true})
    }

    async addProduct(cid, pid) {
        
        const cart = await cartModel.findById(cid)
        if (!cart) throw new Error(`Cart ID ${cid} not found`)
    
        const product = await productModel.findById(pid)
        if (!product) throw new Error(`Product ID ${pid} not found`)
    
        const productInCart = cart.products.find(product => product.product === pid)
        if (productInCart) {
            productInCart.quantity += 1
        } else {
            cart.products.push({ product: pid, quantity: 1 })
        }
        
        return await cartModel.findByIdAndUpdate(cid, { products: cart.products }, { new: true })
    }
    

    async delete(id){
        return await cartModel.findByIdAndDelete(id)
    }

    async deleteProductInCart(cid, pid){
        const cart = await cartModel.findById(cid)
        const productFilter = cart.products.filter(product => product.product != pid)

        return await cartModel.findByIdAndUpdate(cid, {products: productFilter}, {new: true})
    }

    async updateProductInCart(cid, pid, quantity) {
        const cart = await cartModel.findById(cid)
        if (!cart) throw new Error(`Cart ID ${cid} not found`)
    
        const productInCart = cart.products.find(
            product => product.product.toString() === pid
        );
    
        if (!productInCart){
            throw new Error(`Product ID ${pid} not found in Cart ID ${cid}`)
        }
        productInCart.quantity = quantity
    
        return await cartModel.findByIdAndUpdate(cid, { products: cart.products }, { new: true })
    }
    async deleteProductsInCart(cid){
        return await cartModel.findByIdAndUpdate(cid, {products: []}, {new: true})
    }
}

export const CartDao = new cartDao()