const express = require('express');
const Statistics = require('../models/stats');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const stats = await Statistics.getAllStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/summoner-id/:summoner_id', async (req, res) => {
    try {
        const stats = await Statistics.getStatsBySummonerId(req.params.summoner_id);
        stats ? res.status(200).json(stats) : res.status(404).json({ message: "pas trouvé" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  Obtenir le KDA d'un joueur par son summoner_id
router.get('/summoner-id/kda/:summoner_id', async (req, res) => {
    try {
        const kda = await Statistics.calculateKDAByStats(req.params.summoner_id);
        kda ? res.status(200).json(kda) : res.status(404).json({ message: "KDA non trouvé pour ce joueur." });
    } catch (error) {
        res.status(500).json({ message: "error message" });
    }
});
// Obtenir le winrate d'un joueur par son summoner_id
router.get('/summoner-id/:summoner_id/winrate', async (req, res) => {
    try {
        const winRate = await Statistics.calculateWinRate(req.params.summoner_id);
        winRate ? res.status(200).json(winRate) : res.status(404).json({ message: "Win Rate non trouvé pour ce joueur." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newStats = await Statistics.createStats(req.body);
        res.status(201).json(newStats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT to update a team by ID
router.put('/:stats_id', async (req, res) => {
    try {
        const updatedStats = await Statistics.updateStats(req.params.stats_id, req.body);
        res.status(200).json(updatedStats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE a team by ID
router.delete('/:stats_id', async (req, res) => {
    try {
        await Statistics.deleteStats(req.params.stats_id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/:stats_id', async (req, res) => {
    try {
        const existingStats = await Statistics.getStatsById(req.params.stats_id);
        if (!existingStats) {
            return res.status(404).json({ error: "Stats non trouvée pour ce joueur" });
        }

        // On met à jour uniquement les champs fournis dans req.body
        const updatedStats = await Statistics.updateStats(req.params.stats_id, {
            summoner_id: req.body.summoner_id || existingStats.summoner_id,
            region: req.body.region || existingStats.region,
            solo_rank: req.body.solo_rank || existingStats.solo_rank,
            flex_rank: req.body.flex_rank || existingStats.flex_rank,
            solo_wins: req.body.solo_wins || existingStats.solo_wins,
            solo_losses: req.body.solo_losses || existingStats.solo_losses,
            solo_remakes: req.body.solo_remakes || existingStats.solo_remakes,
            flex_wins: req.body.flex_wins || existingStats.flex_wins,
            flex_losses: req.body.flex_losses || existingStats.flex_losses,
            flex_remakes: req.body.flex_remakes || existingStats.flex_remakes,
            kills: req.body.kills || existingStats.kills,
            deaths: req.body.deaths || existingStats.deaths,
            assists: req.body.assists || existingStats.assists
        });

        res.json(updatedStats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
