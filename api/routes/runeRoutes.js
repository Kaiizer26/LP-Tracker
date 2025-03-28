const express = require('express');
const Rune = require('../models/rune');

const router = express.Router();

// GET all runes
router.get('/', async (req, res) => {
    try {
        const runes = await Rune.getAllRunes();
        res.status(200).json(runes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET a specific rune by ID
router.get('/:rune_id', async (req, res) => {
    try {
        const rune = await Rune.getRuneById(req.params.rune_id);
        rune ? res.status(200).json(rune) : res.status(404).json({ message: "Not found" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST a new rune
router.post('/', async (req, res) => {
    try {
        const newRune = await Rune.createRune(req.body);
        res.status(201).json(newRune);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT to update a rune by ID
router.put('/:rune_id', async (req, res) => {
    try {
        const updatedRune = await Rune.updateRune(req.params.rune_id, req.body);
        res.status(200).json(updatedRune);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE a rune by ID
router.delete('/:rune_id', async (req, res) => {
    try {
        await Rune.deleteRune(req.params.rune_id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PATCH a rune by ID (partially update)
router.patch('/:rune_id', async (req, res) => {
    try {
        const existingRune = await Rune.getRuneById(req.params.rune_id);
        if (!existingRune) {
            return res.status(404).json({ error: "Rune non trouvée" });
        }

        const updatedRune = await Rune.updateRune(req.params.rune_id, {
            rune_name: req.body.rune_name || existingRune.rune_name,
            description: req.body.description || existingRune.description
        });

        res.json(updatedRune);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
