const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
    try {
        console.log('Headers received:', req.headers.authorization)
        
        const token = req.headers.authorization?.split(' ')[1]
        console.log('Token extracted:', token)

        if (!token) {
            return res.status(401).json({ message: 'No token, access denied' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.userId
        next()

    } catch (error) {
        console.log('Token error:', error.message)
        res.status(401).json({ message: 'Invalid token' })
    }
}

module.exports = authMiddleware