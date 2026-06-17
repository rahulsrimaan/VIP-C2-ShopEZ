const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true }
}, { timestamps: true })

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    images: { type: [String], default: [] },
    stock: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    brand: { type: String, default: 'ShopEZ' },
    ratings: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    highlights: { type: [String], default: [] },
    specifications: {
        type: Map,
        of: String,
        default: {}
    },
    reviews: [reviewSchema]
}, { timestamps: true })

module.exports = mongoose.model('Product', productSchema)