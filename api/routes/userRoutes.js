const express = require('express');
const User = require('../models/user');

const router = express.Router();

// GET user by summoner name
router.get('/users/summoner/:name', async (req, res) => {
    try {
        const user = await User.getUserBySummonerName(req.params.name);
        user ? res.status(200).json(user) : res.status(404).json({ message: "User not found" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET ranked stats
router.get('/users/:id/ranked', async (req, res) => {
    try {
        const stats = await User.getRankedStats(req.params.id);
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET flex stats
router.get('/users/:id/flex', async (req, res) => {
    try {
        const stats = await User.getFlexStats(req.params.id);
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET normal stats
router.get('/users/:id/normal', async (req, res) => {
    try {
        const stats = await User.getNormalStats(req.params.id);
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET champion mastery
router.get('/users/:id/mastery', async (req, res) => {
    try {
        const mastery = await User.getMastery(req.params.id);
        res.status(200).json(mastery);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET top mastery
router.get('/users/:id/top-mastery', async (req, res) => {
    try {
        const topMastery = await User.getTopMastery(req.params.id);
        res.status(200).json(topMastery);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET champion mastery for a specific champion
router.get('/users/:id/mastery/:championId', async (req, res) => {
    try {
        const mastery = await User.getChampionMastery(req.params.id, req.params.championId);
        res.status(200).json(mastery);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET clash info
router.get('/users/:id/clash', async (req, res) => {
    try {
        const clashInfo = await User.getClashInfo(req.params.id);
        res.status(200).json(clashInfo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET user level
router.get('/users/:id/level', async (req, res) => {
    try {
        const level = await User.getUserLevel(req.params.id);
        res.status(200).json(level);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET user icon
router.get('/users/:id/icon', async (req, res) => {
    try {
        const icon = await User.getUserIcon(req.params.id);
        res.status(200).json(icon);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;