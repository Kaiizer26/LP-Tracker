const express = require('express');
const Items = require('../models/item');

const router = express.Router();

//  POST - Créer un objet
router.post('/items', async (req, res) => {
    try {
        const newItem = await Item.createItem(req.body);
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  GET - Récupérer tous les objets
router.get('/items', async (req, res) => {
    try {
        const items = await Item.getAllItems();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  GET - Récupérer un objet par son ID
router.get('/items/:id', async (req, res) => {
    try {
        const item = await Item.getItemById(req.params.id);
        if (!item) {
            return res.status(404).json({ error: "Objet non trouvé" });
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  PUT - Remplacer complètement un objet
router.put('/items/:id', async (req, res) => {
    try {
        const updatedItem = await Item.updateItem(req.params.id, req.body);
        if (!updatedItem) {
            return res.status(404).json({ error: "Objet non trouvé" });
        }
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  PATCH - Mettre à jour partiellement un objet
router.patch('/items/:id', async (req, res) => {
    try {
        const existingItem = await Item.getItemById(req.params.id);
        if (!existingItem) {
            return res.status(404).json({ error: "Objet non trouvé" });
        }

        const updatedData = {
            itemName: req.body.itemName || existingItem.item_name,
            description: req.body.description || existingItem.description,
            price: req.body.price !== undefined ? req.body.price : existingItem.price
        };

        const updatedItem = await Item.updateItem(req.params.id, updatedData);
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  DELETE - Supprimer un objet
router.delete('/items/:id', async (req, res) => {
    try {
        const deletedItem = await Item.deleteItem(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ error: "Objet non trouvé" });
        }
        res.json({ message: "Objet supprimé avec succès", deletedItem });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
