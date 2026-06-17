const express = require('express')
const router = express.Router()
const { registerAdmin, loginAdmin, getAllOrders, getAllUsers, updateOrderStatus, getBanners, addBanner, deleteBanner } = require('../controllers/adminController')

router.post('/register', registerAdmin)
router.post('/login', loginAdmin)
router.get('/orders', getAllOrders)
router.get('/users', getAllUsers)
router.put('/orders/:id', updateOrderStatus)
router.get('/banners', getBanners)
router.post('/banners', addBanner)
router.delete('/banners/:id', deleteBanner)

module.exports = router