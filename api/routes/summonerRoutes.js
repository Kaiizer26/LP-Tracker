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
// GET SUMMONER by summoner name
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
// PAS UTILISE POUR L'INSTANT
router.get('/summoner-id/:id/flex', async (req, res) => {
    try {
        const stats = await Summoner.getFlexStats(req.params.id);
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET normal stats
// PAS UTILISE POUR L'INSTANT
router.get('/summoner-id/:id/normal', async (req, res) => {
    try {
        const stats = await Summoner.getNormalStats(req.params.id);
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET champion mastery
// PAS UTILISE POUR L'INSTANT
router.get('/summoner-id/:id/mastery', async (req, res) => {
    try {
        const mastery = await Summoner.getMastery(req.params.id);
        res.status(200).json(mastery);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET top mastery
// PAS UTILISE POUR L'INSTANT
router.get('/summoner-id/:id/top-mastery', async (req, res) => {
    try {
        const topMastery = await Summoner.getTopMastery(req.params.id);
        res.status(200).json(topMastery);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET champion mastery for a specific champion
// PAS UTILISE POUR L'INSTANT
router.get('/summoner-id/:id/mastery/:championId', async (req, res) => {
    try {
        const mastery = await Summoner.getChampionMastery(req.params.id, req.params.championId);
        res.status(200).json(mastery);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET clash info
// PAS UTILISE POUR L'INSTANT
router.get('/summoner-id/:id/clash', async (req, res) => {
    try {
        const clashInfo = await Summoner.getClashInfo(req.params.id);
        res.status(200).json(clashInfo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET Summoner level
router.get('/summoner-id/:id/level', async (req, res) => {
    try {
        const level = await Summoner.getSummonerLevel(req.params.id);
        res.status(200).json(level);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET Summoner icon
router.get('/summoner-id/:id/icon', async (req, res) => {
    try {
        const icon = await Summoner.getSummonerIcon(req.params.id);
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
// Modify entirely a summoner by ID

router.put('/summoner-id/:summoner_id', async (req, res) => {
    try {
        const updatedSummoner = await Summoner.updateSummoner(req.params.summoner_id, req.body);
        res.status(200).json(updatedSummoner);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE a summoner by ID

router.delete('/summoner-id/:summoner_id', async (req, res) => {
    try {
        await Summoner.deleteSummoner(req.params.summoner_id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/summoner-id/:summoner_id', async (req, res) => {
    try {
        const existingSummoner = await Summoner.getSummonerById(req.params.summoner_id);
        if (!existingSummoner) {
            return res.status(404).json({ error: "Summoner non trouvée" });
        }

        const updatedSummoner = await Summoner.updateSummoner(req.params.summoner_id, {
            summoner_name: req.body.summoner_name || existingSummoner.summoner_name,
            puuid: req.body.puuid || existingSummoner.puuid,
            region: req.body.region || existingSummoner.region,
            profile_icon_id: req.body.profile_icon_id || existingSummoner.profile_icon_id,
            summoner_level: req.body.summoner_level || existingSummoner.summoner_level,
            ranked_division: req.body.ranked_division || existingSummoner.ranked_division,
            lp: req.body.lp || existingSummoner.lp
        });

        res.json(updatedSummoner);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;