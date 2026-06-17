const express = require('express')
const router = express.Router()
const { addToCart, getCart, removeFromCart, clearCart } = require('../controllers/cartController')
const authMiddleware = require('../middleware')

router.post('/add', authMiddleware, addToCart)
router.get('/', authMiddleware, getCart)
router.delete('/:id', authMiddleware, removeFromCart)
router.delete('/clear/all', authMiddleware, clearCart)

module.exports = router