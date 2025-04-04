const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const path = require('path');
const router = express.Router();

// Configuration de multer pour gérer l'upload des fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/img'));  // Dossier où les fichiers seront stockés
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));  // Nom du fichier basé sur le timestamp
    }
});
  
const upload = multer({ storage: storage });

// Route pour obtenir tous les utilisateurs
router.get('/', async (req, res) => {
    try {
        const users = await User.getAllUsers();
        users ? res.status(200).json(users) : res.status(404).json({ message: "Aucun utilisateur trouvé" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route pour récupérer un utilisateur par nom d'utilisateur
router.get('/username/:username', async (req, res) => {
    try {
        const user = await User.getUserByUsername(req.params.username);
        user ? res.status(200).json(user) : res.status(404).json({ message: "User not found" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route pour récupérer un utilisateur par son ID
router.get('/user-id/:user_id', async (req, res) => {
    try {
        const user = await User.getUserById(req.params.user_id);
        user ? res.status(200).json(user) : res.status(404).json({ message: "User not found" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route d'enregistrement (register) - avec gestion de l'upload de fichier
router.post('/register', upload.single('user_image'), async (req, res) => {
    const { username, email, password } = req.body;
    const user_image = req.file ? req.file.path : null;  // Récupère le chemin de l'image téléchargée

    if (!email || !password || !username) {
        return res.status(400).json({ error: "Email, mot de passe et nom d'utilisateur sont requis." });
    }

    try {
        // Vérifier si l'email existe déjà
        const existingUser = await User.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: "L'email est déjà associé à un autre compte." });
        }

        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);  // Salt rounds = 10

        // Créer un nouvel utilisateur dans la base de données
        const newUser = await User.createUser({
            username,
            user_image,  // Inclure l'image de l'utilisateur
            email,
            password: hashedPassword  // Utiliser le mot de passe haché
        });

        // Générer un token JWT pour l'utilisateur nouvellement créé
        const token = jwt.sign(
            { user_id: newUser.user_id, username: newUser.username },
            'secretKey',  // Utilisez une clé secrète (stockée dans les variables d'environnement pour plus de sécurité)
            { expiresIn: '1h' }
        );

        // Répondre avec le token et les informations de l'utilisateur
        res.status(201).json({
            message: 'Utilisateur créé avec succès',
            token,
            username: newUser.username,
            user_id: newUser.user_id
        });
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);  // Affichez l'erreur complète dans la console
        res.status(500).json({ error: error.message || 'Une erreur est survenue lors de l\'inscription.' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Vérifier si email et mot de passe sont présents dans la requête
    if (!email || !password) {
        console.log("Email ou mot de passe manquant");
        return res.status(400).json({ error: "Email et mot de passe sont requis." });
    }

    try {
        // Chercher l'utilisateur dans la base de données par email
        const user = await User.getUserByEmail(email);
        if (!user) {
            console.log("Utilisateur non trouvé avec l'email:", email);
            return res.status(400).json({ error: "Email ou mot de passe incorrect." });
        }

        // Comparer le mot de passe envoyé avec le mot de passe haché dans la base de données
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log("Mot de passe incorrect pour l'utilisateur:", email);
            return res.status(400).json({ error: "Email ou mot de passe incorrect." });
        }

        // Générer un token JWT
        const token = jwt.sign(
            { user_id: user.user_id, username: user.username },  // Les informations à inclure dans le token
            'secretKey',  // Utilisez une clé secrète, de préférence stockée dans les variables d'environnement
            { expiresIn: '1h' }  // Le token expirera dans une heure
        );

        // Répondre avec le token et les informations de l'utilisateur
        res.status(200).json({
            message: 'Connexion réussie',
            token,  // Le token JWT pour l'authentification future
            username: user.username,
            user_id: user.user_id
        });
    } catch (error) {
        console.error("Erreur de connexion:", error);
        res.status(500).json({ error: "Erreur lors de la connexion." });
    }
});

// Modifier entièrement un utilisateur par ID
router.put('/:user_id', async (req, res) => {
    try {
        const updatedUser = await User.updateUser(req.params.user_id, req.body);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Modifier partiellement un utilisateur par ID
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
        res.status(500).json({ error: error.message });
    }
});

// Supprimer un utilisateur par ID
router.delete('/:user_id', async (req, res) => {
    try {
        await User.deleteUser(req.params.user_id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
