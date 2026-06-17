const Cart = require('../models/Cart')

// ADD TO CART
const addToCart = async (req, res) => {
    try {
        const { productId, productName, price, quantity, image } = req.body

        // Check if product already in cart
        const existingItem = await Cart.findOne({ 
            userId: req.userId, 
            productId 
        })

        if (existingItem) {
            existingItem.quantity += 1
            await existingItem.save()
            return res.status(200).json({ message: 'Cart updated', cart: existingItem })
        }

        const newCartItem = new Cart({
            userId: req.userId,
            productId,
            productName,
            price,
            quantity,
            image
        })

        await newCartItem.save()
        res.status(201).json({ message: 'Added to cart', cart: newCartItem })

    } catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
}

// GET CART
const getCart = async (req, res) => {
    try {
        const cartItems = await Cart.find({ userId: req.userId })
        res.status(200).json(cartItems)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
}

// REMOVE FROM CART
const removeFromCart = async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: 'Removed from cart' })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
}

// CLEAR CART
const clearCart = async (req, res) => {
    try {
        await Cart.deleteMany({ userId: req.userId })
        res.status(200).json({ message: 'Cart cleared' })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
}

module.exports = { addToCart, getCart, removeFromCart, clearCart }