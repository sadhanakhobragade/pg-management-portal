// backend/authMiddleware.js

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

// 1. Middleware to verify JWT and attach user info to request (req.user)
exports.protect = (req, res, next) => {
    // Get token from header (format: "Bearer TOKEN")
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Attach user payload (userId and role) to the request object
        req.user = decoded; 
        
        next(); // Proceed to the next middleware or route handler

    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// 2. Middleware to restrict access to only users with the 'owner' role
exports.ownerOnly = (req, res, next) => {
    // Assumes 'protect' middleware has run and attached req.user
    if (req.user && req.user.role === 'owner') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Access denied for this role' });
    }
};