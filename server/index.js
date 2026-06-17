const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const userRoutes = require('./routes/userRoutes')
const productRoutes = require('./routes/productRoutes')
const orderRoutes = require('./routes/orderRoutes')
const cartRoutes = require('./routes/cartRoutes')
const adminRoutes = require('./routes/adminRoutes')

const app = express()
const PORT = process.env.PORT || 8000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/admin', adminRoutes)

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected ✅'))
.catch((err) => console.log('MongoDB error:', err))

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})