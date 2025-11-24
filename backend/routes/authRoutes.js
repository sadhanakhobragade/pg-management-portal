// backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // For generating tokens
const User = require('../models/User');
const { JWT_SECRET } = process.env; // Get secret key from .env

// @route POST /api/auth/register
// @desc Register a new user (owner or tenant)
router.post('/register', async (req, res) => {
    const { name, email, password, role, room } = req.body;
    
    try {
        // 1. Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 2. Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create New User
        user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'tenant', // Default to tenant if role is not specified
            room: room || null,
        });

        await user.save();

        // 4. Respond with token (login immediately after registration)
        const payload = { userId: user.id, role: user.role };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token, user: { id: user.id, name: user.name, role: user.role } });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error during registration.');
    }
});

// @route POST /api/auth/login
// @desc Authenticate user and get token
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // 2. Compare Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // 3. Generate Token
        const payload = { userId: user.id, role: user.role };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user: { id: user.id, name: user.name, role: user.role } });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error during login.');
    }
});

module.exports = router;