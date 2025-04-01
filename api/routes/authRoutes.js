const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Assure-toi d'avoir un modèle User configuré dans /models

const router = express.Router();

// Inscription
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Vérifie si l'email existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    // Hashage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword
    });

    // Créer un token JWT
    const token = jwt.sign({ userId: newUser.user_id }, 'secretKey', { expiresIn: '1h' });

    res.status(201).json({ message: 'Utilisateur créé avec succès', token });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Trouve l'utilisateur par email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Comparaison des mots de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    // Créer un token JWT
    const token = jwt.sign({ userId: user.user_id }, 'secretKey', { expiresIn: '1h' });

    res.json({ message: 'Connexion réussie', token });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
});

module.exports = router;
