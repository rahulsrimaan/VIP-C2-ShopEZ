const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    categories: { type: [String], default: [] },
    banners: [{
        image: { type: String, required: true },
        title: { type: String, required: true },
        subtitle: { type: String, default: '' },
        link: { type: String, default: '/products' },
        bgColor: { type: String, default: '#1a1a2e' }
    }]
}, { timestamps: true })

module.exports = mongoose.model('Admin', adminSchema)