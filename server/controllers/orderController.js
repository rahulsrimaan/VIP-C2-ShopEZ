const Orders = require('../models/Orders')
const Product = require('../models/Product')

// PLACE ORDER
const placeOrder = async (req, res) => {
    try {
        const { productId, productName, price, quantity, address, paymentMethod } = req.body

        // Check product stock
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }
        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' })
        }

        // Reduce stock
        product.stock -= quantity
        await product.save()

        // Place order
        const newOrder = new Orders({
            userId: req.userId,
            productId,
            productName,
            price,
            quantity,
            address,
            paymentMethod
        })

        await newOrder.save()
        res.status(201).json({ message: 'Order placed successfully', order: newOrder })

    } catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
}

// GET USER ORDERS
const getUserOrders = async (req, res) => {
    try {
        const orders = await Orders.find({ userId: req.userId })
        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
}

// GET ALL ORDERS (Admin)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Orders.find()
        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
}
// CANCEL ORDER
const cancelOrder = async (req, res) => {
    try {
        const order = await Orders.findById(req.params.id)

        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }

        if (order.userId.toString() !== req.userId.toString()) {
            return res.status(401).json({ message: 'Not authorized' })
        }

        if (order.status === 'Delivered') {
            return res.status(400).json({ message: 'Cannot cancel delivered order' })
        }

        if (order.status === 'Cancelled') {
            return res.status(400).json({ message: 'Order already cancelled' })
        }

        // Restore stock
        const product = await Product.findById(order.productId)
        if (product) {
            product.stock += order.quantity
            await product.save()
        }

        order.status = 'Cancelled'
        await order.save()

        res.status(200).json({ message: 'Order cancelled successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
}
module.exports = { placeOrder, getUserOrders, getAllOrders, cancelOrder }