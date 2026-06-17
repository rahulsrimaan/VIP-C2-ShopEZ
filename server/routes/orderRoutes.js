const express = require('express')
const router = express.Router()
const { placeOrder, getUserOrders, getAllOrders, cancelOrder } = require('../controllers/orderController')
const authMiddleware = require('../middleware')

router.post('/place', authMiddleware, placeOrder)
router.get('/myorders', authMiddleware, getUserOrders)
router.get('/all', authMiddleware, getAllOrders)
router.put('/cancel/:id', authMiddleware, cancelOrder)

module.exports = router