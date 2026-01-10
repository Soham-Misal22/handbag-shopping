
const express = require('express')
const isLogin = require('../middlewares/isLogin')
const productModel = require('../models/productSchema')
const userModel = require('../models/userModel')
const route = express()

route.get('/', async (req, res) => {
    try {

        const products = await productModel.find();

        const formattedProducts = products.map(p => {
            const obj = p.toObject(); // convert Mongoose doc → plain object

            if (obj.image) {
                obj.image = `data:image/png;base64,${obj.image.toString('base64')}`;
            }

            return obj;
        });

        return res.status(200).json({
            success: true,
            data: formattedProducts
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch products'
        });
    }
});



route.get('/shop', isLogin, (req, res) => {
    res.send({ authenticated: true, user: req.user })
})


route.post('/addtocart', isLogin, async (req, res) => {
    try {

        const { productId } = req.body
        console.log('user', req.user)
        let user = await userModel.findOne({ email: req.user.email });

        const existingItem = user.cart.find(
            item => item.product.toString() === productId
        );
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cart.push({ product: productId, quantity: 1 });
        }
        await user.save();
        return res.status(200).json({ 'success': true });
    } catch (error) {
        console.error("Add to cart error:", error);
        res.status(401).json({ 'success': false, "message": "something went wrong" })
    }

})


route.get('/cart', isLogin, async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.user.email }).populate('cart.product');

         const formatteddata = user.cart.map(p => {

            let {product, quantity} = p
            const obj = product.toObject(); // convert Mongoose doc → plain object

            if (obj.image) {
                obj.image = `data:image/png;base64,${obj.image.toString('base64')}`;
            }

            return {
        product: obj,
        quantity
      };
        });

        return res.status(200).json({
            success: true,
            cart: formatteddata
        });
    } catch (error) {
        console.error("Add to cart error:", error);
        res.status(401).json({ 'success': false, "message": "something went wrong" })
    }
})




route.post('/cart/:action', isLogin, async (req, res) => {
  try {
    const { productId } = req.body;
    const { action } = req.params;

    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID required" });
    }

    const item = req.user.cart.find(
      i => i.product && i.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found in cart" });
    }

    if (action === "decrement") {
      if (item.quantity > 1) {
        item.quantity -= 1;
      }
      else if(item.quantity == 1)
      {
        let index = req.user.cart.findIndex(
      item => item.product && item.product.toString() === productId
    ); 
      req.user.cart.splice(index,1)
      }
    } else if (action === "increment") {
      item.quantity += 1;
    } else {
      return res.status(400).json({ success: false, message: "Invalid action" });
    }

    await req.user.save();

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("Cart update error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = route;
