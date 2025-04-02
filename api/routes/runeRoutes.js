const express = require('express');
const router = express.Router();
const Rune = require('../models/rune');  // Le chemin vers ton fichier contenant la classe Rune

// Récupérer toutes les runes
router.get('/', async (req, res) => {
    try {
        const runes = await Rune.getAllRunes();
        res.json(runes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Récupérer une rune par son ID
router.get('/:rune_id', async (req, res) => {
    const { rune_id } = req.params;
    try {
        const rune = await Rune.getRuneById(rune_id);
        if (!rune) {
            return res.status(404).json({ error: 'Rune non trouvée' });
        }
        res.json(rune);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Créer une nouvelle rune
router.post('/', async (req, res) => {
    const { rune_name, description } = req.body;
    try {
        const newRune = await Rune.createRune({ rune_name, description });
        res.status(201).json(newRune);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Mettre à jour une rune existante
router.put('/:rune_id', async (req, res) => {
    const { rune_id } = req.params;
    const { rune_name, description } = req.body;
    try {
        const updatedRune = await Rune.updateRune(rune_id, { rune_name, description });
        if (!updatedRune) {
            return res.status(404).json({ error: 'Rune non trouvée' });
        }
        res.json(updatedRune);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Supprimer une rune
router.delete('/:rune_id', async (req, res) => {
    const { rune_id } = req.params;
    try {
        const deletedRune = await Rune.deleteRune(rune_id);
        if (!deletedRune) {
            return res.status(404).json({ error: 'Rune non trouvée' });
        }
        res.json({ message: `Rune avec ID ${rune_id} supprimée` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;
