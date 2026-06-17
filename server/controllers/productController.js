const Product = require('../models/Product')

// ADD PRODUCT
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, image, stock, discount } = req.body

        const newProduct = new Product({
            name,
            description,
            price,
            category,
            image,
            stock,
            discount
        })

        await newProduct.save()
        res.status(201).json({ message: 'Product added successfully', product: newProduct })

    } catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
}

// GET ALL PRODUCTS
const getProducts = async (req, res) => {
    try {
        const { category, search } = req.query
        let filter = {}

        if (category && category !== 'all') {
            filter.category = { $regex: category, $options: 'i' }
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ]
        }

        const products = await Product.find(filter)
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
}

// GET SINGLE PRODUCT
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
}

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: 'Product deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
}
// ADD REVIEW
const addReview = async (req, res) => {
    try {
        const { rating, comment, username } = req.body
        const product = await Product.findById(req.params.id)

        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        // Check if user already reviewed
        const alreadyReviewed = product.reviews.find(
            r => r.userId.toString() === req.userId.toString()
        )
        if (alreadyReviewed) {
            return res.status(400).json({ message: 'You already reviewed this product' })
        }

        const review = {
            userId: req.userId,
            username,
            rating: Number(rating),
            comment
        }

        product.reviews.push(review)
        product.numReviews = product.reviews.length
        product.ratings = product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length

        await product.save()
        res.status(201).json({ message: 'Review added successfully' })

    } catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
}
module.exports = { addProduct, getProducts, getProductById, deleteProduct, addReview }