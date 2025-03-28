const express = require('express');
const Spell = require('../models/spell');

const router = express.Router();

// GET all spells
router.get('/', async (req, res) => {
    try {
        const spells = await Spell.getAllSpells();
        res.status(200).json(spells);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET a specific spell by ID
router.get('/:spell_id', async (req, res) => {
    try {
        const spell = await Spell.getSpellById(req.params.spell_id);
        spell ? res.status(200).json(spell) : res.status(404).json({ message: "Not found" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST a new spell
router.post('/', async (req, res) => {
    try {
        const newSpell = await Spell.createSpell(req.body);
        res.status(201).json(newSpell);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT to update a spell by ID
router.put('/:spell_id', async (req, res) => {
    try {
        const updatedSpell = await Spell.updateSpell(req.params.spell_id, req.body);
        res.status(200).json(updatedSpell);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE a spell by ID
router.delete('/:spell_id', async (req, res) => {
    try {
        await Spell.deleteSpell(req.params.spell_id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/:spell_id', async (req, res) => {
    try {
        const existingSpell = await Spell.getSpellById(req.params.spell_id);
        if (!existingSpell) {
            return res.status(404).json({ error: "Équipe non trouvée" });
        }

        // On met à jour uniquement les champs fournis dans req.body
        const updatedSpell = await Spell.updateSpell(req.params.spell_id, {
            champion_id: req.body.champion_id || existingSpell.champion_id,
            spell_name: req.body.spell_name || existingSpell.spell_name,
            description: req.body.description || existingSpell.description,
            spell_picture: req.body.spell_picture || existingSpell.spell_picture,
            spell_type: req.body.spell_type || existingSpell.spell_type
        });

        res.json(updatedSpell);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;