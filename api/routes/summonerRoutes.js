const express = require('express');
const Summoner = require('../models/summoner');

const router = express.Router();

// GET ALL summoners
router.get('/', async (req, res) => {
    try {
        const user = await Summoner.getAllSummoners();
        user ? res.status(200).json(user) : res.status(404).json({ message: "Aucun utilisateur trouvé" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET user by summoner name
router.get('/summoner-name/:name', async (req, res) => {
    try {
        const user = await Summoner.getSummonerBySummonerName(req.params.name);
        user ? res.status(200).json(user) : res.status(404).json({ message: "Summoner not found" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET Summoner by id
router.get('/summoner-id/:summoner_id', async (req, res) => {
    try {
        const user = await Summoner.getSummonerById(req.params.summoner_id);
        user ? res.status(200).json(user) : res.status(404).json({ message: "Summoner not found" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET ranked stats
router.get('/summoner-id/:id/ranked', async (req, res) => {
    try {
        const stats = await Summoner.getRankedStats(req.params.id);
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET flex stats
router.get('/summoners/:id/flex', async (req, res) => {
    try {
        const stats = await Summoner.getFlexStats(req.params.id);
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET normal stats
router.get('/summoners/:id/normal', async (req, res) => {
    try {
        const stats = await Summoner.getNormalStats(req.params.id);
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET champion mastery
router.get('/summoners/:id/mastery', async (req, res) => {
    try {
        const mastery = await Summoner.getMastery(req.params.id);
        res.status(200).json(mastery);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET top mastery
router.get('/summoners/:id/top-mastery', async (req, res) => {
    try {
        const topMastery = await Summoner.getTopMastery(req.params.id);
        res.status(200).json(topMastery);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET champion mastery for a specific champion
router.get('/summoners/:id/mastery/:championId', async (req, res) => {
    try {
        const mastery = await Summoner.getChampionMastery(req.params.id, req.params.championId);
        res.status(200).json(mastery);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET clash info
router.get('/summoners/:id/clash', async (req, res) => {
    try {
        const clashInfo = await Summoner.getClashInfo(req.params.id);
        res.status(200).json(clashInfo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET Summoner level
router.get('/summoners/:id/level', async (req, res) => {
    try {
        const level = await Summoner.getUserLevel(req.params.id);
        res.status(200).json(level);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET Summoner icon
router.get('/summoners/:id/icon', async (req, res) => {
    try {
        const icon = await Summoner.getUserIcon(req.params.id);
        res.status(200).json(icon);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newSummoner = await Summoner.createSummoner(req.body);
        res.status(201).json(newSummoner);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;