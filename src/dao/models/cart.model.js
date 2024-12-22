import mongoose from "mongoose";

const cartsCollection = "carts"

const cartSchema = new mongoose.Schema({
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
        quantity: { type: Number, default: 1 }
    }]
});

cartSchema.pre("find", function () {
    
    this.populate("products.product");
  });
export const cartModel = mongoose.model(cartsCollection, cartSchema)