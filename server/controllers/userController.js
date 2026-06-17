const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// REGISTER
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body

        // Check if user already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' })
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        await newUser.save()
        res.status(201).json({ message: 'User registered successfully' })

    } catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
}

// LOGIN
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        // Check if user exists
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })

    } catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
}

module.exports = { registerUser, loginUser }