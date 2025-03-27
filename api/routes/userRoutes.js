const express = require('express');
const User = require('../models/user');

const router = express.Router();

// GET ALL users
router.get('/', async (req, res) => {
    try {
        const user = await User.getAllUsers();
        user ? res.status(200).json(user) : res.status(404).json({ message: "Aucun utilisateur trouvé" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET users by username
router.get('/username/:username', async (req, res) => {
    try {
        const user = await User.getUserByUsername(req.params.username);
        user ? res.status(200).json(user) : res.status(404).json({ message: "User not found" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET User by id
router.get('/user-id/:user_id', async (req, res) => {
    try {
        const user = await User.getUserById(req.params.user_id);
        user ? res.status(200).json(user) : res.status(404).json({ message: "User not found" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newUser = await User.createUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Modify entirely a user by ID

router.put('/:user_id', async (req, res) => {
    try {
        const updatedUser = await User.updateUser(req.params.user_id, req.body);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE a summoner by ID


router.patch('/:user_id', async (req, res) => {
    try {
        const existingUser = await User.getUserById(req.params.user_id);
        if (!existingUser) {
            return res.status(404).json({ error: "Utilisateur non trouvée" });
        }

        const updatedUser = await User.updateUser(req.params.user_id, {
            username: req.body.username || existingUser.username,
            email: req.body.email || existingUser.email,
            password: req.body.password || existingUser.password
        });

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.delete('/:user_id', async (req, res) => {
    try {
        await User.deleteUser(req.params.user_id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;