const express = require('express');
const ChampionMastery = require('../models/championmastery');

const router = express.Router();
// Endpoints for matches
router.get('/', async (req, res) => {
    try {
        const championmastery = await ChampionMastery.getAllChampionsMasteries();
        championmastery ? res.status(200).json(championmastery) : res.status(404).json(championmastery);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/summoner/:summoner_id', async (req, res) => {
    try {
        const championmastery = await ChampionMastery.getChampionMasteryBySummonerId(req.params.summoner_id);
        championmastery ? res.status(200).json(championmastery) : res.status(404).json(championmastery);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/champion/:champion_id', async (req, res) => {
    try {
        const championmastery = await ChampionMastery.getChampionMasteriesByChampionId(req.params.champion_id);
        championmastery ? res.status(200).json(championmastery) : res.status(404).json(championmastery);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Master level
router.get('/master-level/:champion_mastery_id', async (req, res) => {
    try {
        const championmastery = await ChampionMastery.getMasteryLevelByChampionMasteryId(req.params.champion_mastery_id);
        championmastery ? res.status(200).json(championmastery) : res.status(404).json(championmastery);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mastery points
router.get('/mastery-points/:champion_mastery_id', async (req, res) => {
    try {
        const championmastery = await ChampionMastery.getMasteryPointsByChampionMasteryId(req.params.champion_mastery_id);
        championmastery ? res.status(200).json(championmastery) : res.status(404).json(championmastery);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newChampionMastery = await ChampionMastery.createMatchParticipant(req.body);
        res.status(201).json(newChampionMastery);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:champion_mastery_id', async (req, res) => {
    try {
        const updatedChampionMastery = await ChampionMastery.updatedChampionMastery(req.params.champion_mastery_id, req.body);
        res.status(200).json(updatedChampionMastery);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/:champion_mastery_id', async (req, res) => {
    try {
        const existingChampionMastery = await ChampionMastery.getChampionMasteryById(req.params.champion_mastery_id);
        if (!existingChampionMastery) {
            return res.status(404).json({ error: "Maîtrise du champion non trouvée" });
        }

        // On met à jour uniquement les champs fournis dans req.body
        const updatedChampionMastery= await ChampionMastery.updatedChampionMastery(req.params.champion_mastery_id, {
            summoner_id: req.body.summoner_id || existingChampionMastery.summoner_id,
            champion_id: req.body.champion_id || existingChampionMastery.champion_id,
            master_level: req.body.master_level || existingChampionMastery.master_level,
            mastery_points: req.body.mastery_points || existingChampionMastery.mastery_points
        });

        res.json(updatedChampionMastery);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:champion_mastery_id', async (req, res) => {
    try {
        await ChampionMastery.deleteChampionMastery(req.params.champion_mastery_id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router