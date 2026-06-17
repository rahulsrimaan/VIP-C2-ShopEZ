const Admin = require('../models/Admin')
const Product = require('../models/Product')
const Orders = require('../models/Orders')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// ADMIN REGISTER
const registerAdmin = async (req, res) => {
    try {
        const { username, email, password } = req.body

        const existingAdmin = await Admin.findOne({ email })
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newAdmin = new Admin({
            username,
            email,
            password: hashedPassword
        })

        await newAdmin.save()
        res.status(201).json({ message: 'Admin registered successfully' })

    } catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
}

// ADMIN LOGIN
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body

        const admin = await Admin.findOne({ email })
        if (!admin) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        const isMatch = await bcrypt.compare(password, admin.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        const token = jwt.sign(
            { adminId: admin._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.status(200).json({
            message: 'Admin login successful',
            token,
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email
            }
        })

    } catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
}

// GET ALL ORDERS
const getAllOrders = async (req, res) => {
    try {
        const orders = await Orders.find()
        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
}

// GET ALL USERS
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password')
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
}

// UPDATE ORDER STATUS
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body
        const order = await Orders.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        )
        res.status(200).json({ message: 'Order status updated', order })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
}
// GET BANNERS
const getBanners = async (req, res) => {
    try {
        const admin = await Admin.findOne()
        res.status(200).json(admin?.banners || [])
    } catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
}

// ADD BANNER
const addBanner = async (req, res) => {
    try {
        const { image, title, subtitle, link, bgColor } = req.body
        const admin = await Admin.findOne()
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' })
        }
        admin.banners.push({ image, title, subtitle, link, bgColor })
        await admin.save()
        res.status(201).json({ message: 'Banner added successfully', banners: admin.banners })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
}

// DELETE BANNER
const deleteBanner = async (req, res) => {
    try {
        const admin = await Admin.findOne()
        admin.banners = admin.banners.filter(b => b._id.toString() !== req.params.id)
        await admin.save()
        res.status(200).json({ message: 'Banner deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
}

module.exports = { registerAdmin, loginAdmin, getAllOrders, getAllUsers, updateOrderStatus, getBanners, addBanner, deleteBanner }