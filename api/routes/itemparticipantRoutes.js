const express = require('express');
const ItemParticipant = require('../models/itemparticipant');

const router = express.Router();
// Endpoints for matches

// Match participant (stat d'un match d'un seul joueur)

router.get('/', async (req, res) => {
    try {
        const itemparticipants = await ItemParticipant.getAllItemsParticipants();
        itemparticipants ? res.status(200).json(itemparticipants) : res.status(404).json({ message: "Not found" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/:item_participant_id', async (req, res) => {
    try {
        const itemparticipant = await ItemParticipant.getItemParticipantById(req.params.item_participant_id);
        itemparticipant ? res.status(200).json(itemparticipant) : res.status(404).json({ message: "Not found" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Essai
router.get('/names/:item_participant_id', async (req, res) => {
    try {
        const ItemsNames = await ItemParticipant.getItemsByParticipantId(
            req.params.item_participant_id
        );
        ItemsNames
            ? res.status(200).json(ItemsNames)
            : res.status(404).json({ message: "Items not found" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// cop
router.get('/match/:match_participant_id', async (req, res) => {
    try {
        const itemsNames = await ItemParticipant.getItemsByMatchParticipantId(
            req.params.match_participant_id
        );
        itemsNames
            ? res.status(200).json(itemsNames)
            : res.status(404).json({ message: "Items not found for the given match participant ID" });
    } catch (error) {
        console.error("Error in /match/:match_participant_id:", error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newItemParticipant = await ItemParticipant.createItemParticipant(req.body);
        res.status(201).json(newItemParticipant);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:item_participant_id', async (req, res) => {
    try {
        const updatedItemParticipant = await ItemParticipant.updateItemParticipant(req.params.item_participant_id, req.body);
        res.status(200).json(updatedItemParticipant);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/:item_participant_id', async (req, res) => {
    try {
        const existingItemParticipant = await ItemParticipant.getItemsParticipantById(req.params.item_participant_id);
        if (!existingItemParticipant) {
            return res.status(404).json({ error: "Match non trouvée" });
        }

        // On met à jour uniquement les champs fournis dans req.body
        const updatedItemParticipant= await ItemParticipant.updateItemParticipant(req.params.item_participant_id, {
            item1_id: req.body.item1_id || existingItemParticipant.item1_id,
            item2_id: req.body.item2_id || existingItemParticipant.item2_id,
            item3_id: req.body.item3_id || existingItemParticipant.item3_id,
            item4_id: req.body.item4_id || existingItemParticipant.item4_id,
            item5_id: req.body.item5_id || existingItemParticipant.item5_id,
            item6_id: req.body.item6_id || existingItemParticipant.item6_id,
            item_vision_id: req.body.item_vision_id || existingItemParticipant.item_vision_id
        });

        res.json(updatedItemParticipant);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:item_participant_id', async (req, res) => {
    try {
        await ItemParticipant.deleteItemParticipant(req.params.item_participant_id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router