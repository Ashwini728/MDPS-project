const { Router } = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = Router();

// Create JWT token
const createToken = (id) => jwt.sign({ id }, 'super_secret_key', { expiresIn: '3d' });

// Register user
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = await User.create({ username, email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 });
        res.status(201).json({ user: user._id });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.login(username, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 });
        res.status(200).json({ user: user._id });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
