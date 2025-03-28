const express = require('express');
const Friend = require('../models/friends');

const router = express.Router();

// GET tous les amis du joueur
router.get('/:user_id', async (req, res) => {
    try {
        const friends = await Friend.getFriendsOfUser(req.params.user_id);
        res.status(200).json(friends);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET statut d'amitié entre deux utilisateurs pending', 'accepted', 'blocked
router.get('/:user_id1/:user_id2', async (req, res) => {
    try {
        const { user_id1, user_id2 } = req.params;
        const friendship = await Friend.getFriendship(user_id1, user_id2);
        if (friendship) {
            res.status(200).json(friendship);
        } else {
            res.status(404).json({ message: "Relation non trouvée" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST envoyer une demande d'amis
router.post('/', async (req, res) => {
    try {
        const { user_id1, user_id2 } = req.body;
        const newRequest = await Friend.sendFriendRequest(user_id1, user_id2);
        res.status(201).json(newRequest);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT chnger le statut d'amitié entre deux utilisateurs debloque quelqun etc
router.put('/:user_id1/:user_id2', async (req, res) => {
    try {
        const { user_id1, user_id2 } = req.params;
        const { status } = req.body;

        if (!['pending', 'accepted', 'blocked'].includes(status)) {
            return res.status(400).json({ error: "Statut invalide" });
        }

        const updated = await Friend.updateFriendStatus(user_id1, user_id2, status);
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE supprimer un ami
router.delete('/:user_id1/:user_id2', async (req, res) => {
    try {
        const { user_id1, user_id2 } = req.params;
        await Friend.deleteFriendship(user_id1, user_id2);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
