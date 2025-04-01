const express = require('express');
const Item = require('../models/item');

const router = express.Router();

// GET all items
router.get('/', async (req, res) => {
    try {
        const items = await Item.getAllItems();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET a specific item by ID
router.get('/:item_id', async (req, res) => {
    try {
        const item = await Item.getItemById(req.params.item_id);
        item ? res.status(200).json(item) : res.status(404).json({ message: "Not found" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST a new item
router.post('/', async (req, res) => {
    try {
        const newItem = await Item.createItem(req.body);
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT to update a team by ID
router.put('/:item_id', async (req, res) => {
    try {
        const updatedItem = await Item.updateItem(req.params.item_id, req.body);
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE a team by ID
router.delete('/:item_id', async (req, res) => {
    try {
        await Item.deleteItem(req.params.item_id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/:item_id', async (req, res) => {
    try {
        const existingItem = await Item.getItemById(req.params.item_id);
        if (!existingItem) {
            return res.status(404).json({ error: "Équipe non trouvée" });
        }

        // On met à jour uniquement les champs fournis dans req.body
        const updatedItem = await Item.updateItem(req.params.item_id, {
            item_name: req.body.item_name || existingItem.item_name,
            description: req.body.description || existingItem.description,
            price: req.body.price || existingItem.price
        });

        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;