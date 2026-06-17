const express = require('express')
const router = express.Router()
const { addProduct, getProducts, getProductById, deleteProduct, addReview } = require('../controllers/productController')
const authMiddleware = require('../middleware')

router.post('/add', authMiddleware, addProduct)
router.get('/', getProducts)
router.get('/:id', getProductById)
router.delete('/:id', authMiddleware, deleteProduct)
router.post('/:id/review', authMiddleware, addReview)

module.exports = router