const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const saltRounds = 10; 

const router = express.Router();

// GET ALL users
router.get('/', async (req, res) => {
    try {
        const users = await User.getAllUsers();
        users ? res.status(200).json(users) : res.status(404).json({ message: "Aucun utilisateur trouvé" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET users by username
router.get('/username/:username', async (req, res) => {
    try {
        const user = await User.getUserByUsername(req.params.username);
        user ? res.status(200).json(user) : res.status(404).json({ message: "Utilisateur non trouvé" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET User by id
router.get('/user-id/:user_id', async (req, res) => {
    try {
        const user = await User.getUserById(req.params.user_id);
        user ? res.status(200).json(user) : res.status(404).json({ message: "Utilisateur non trouvé" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CREATE a new user (inscription)
router.post('/', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Vérifier si l'email existe déjà
        const existingEmail = await User.getUserByEmail(email);
        if (existingEmail) {
            return res.status(400).json({ error: "L'email est déjà associé à un autre compte." });
        }

        // Vérifier si l'username existe déjà
        const existingUser = await User.getUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ error: "Le nom d'utilisateur est déjà pris." });
        }

        // Hacher le mot de passe avant de le sauvegarder
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Créer l'utilisateur avec le mot de passe haché
        const newUser = await User.createUser({
            username,
            email,
            password: hashedPassword // Utiliser le mot de passe haché
        });

        res.status(201).json(newUser); // Utilisateur créé avec succès
    } catch (error) {
        res.status(500).json({ error: error.message }); // Gestion des erreurs
    }
});
// Modify user by ID (Update complete)
router.put('/:user_id', async (req, res) => {
    try {
        const updatedUser = await User.updateUser(req.params.user_id, req.body);
        res.status(200).json(updatedUser); // Utilisateur mis à jour avec succès
    } catch (error) {
        res.status(500).json({ error: error.message }); // Gestion des erreurs
    }
});

// PARTIAL UPDATE (PATCH) user by ID
router.patch('/:user_id', async (req, res) => {
    try {
        const existingUser = await User.getUserById(req.params.user_id);
        if (!existingUser) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        const updatedUser = await User.updateUser(req.params.user_id, {
            username: req.body.username || existingUser.username,
            email: req.body.email || existingUser.email,
            password: req.body.password || existingUser.password
        });

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message }); // Gestion des erreurs
    }
});

// DELETE user by ID
router.delete('/:user_id', async (req, res) => {
    try {
        await User.deleteUser(req.params.user_id);
        res.status(204).send(); // Suppression réussie
    } catch (error) {
        res.status(500).json({ error: error.message }); // Gestion des erreurs
    }
});

// Route de connexion
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Vérifier si l'utilisateur existe
        const user = await User.getUserByEmail(email);
        if (!user) {
            return res.status(400).json({ error: "Email ou mot de passe incorrect."  });
        }

        // Vérifier si le mot de passe est correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Email ou mot de passe incorrect." + isPasswordValid });
        }

        // Générer un token JWT
        const token = jwt.sign({ user_id: user.user_id, username: user.username }, 'secretKey', { expiresIn: '1h' });

        // Retourner le token au frontend
        res.status(200).json({ token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la connexion." });
    }
});

module.exports = router;
