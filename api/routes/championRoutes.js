const express = require('express');
const Champion = require('../models/champion');

const router = express.Router();




//  GET - Obtenir la liste complète des champions
router.get('/', async (req, res) => {
    try {
        const champions = await Champion.getAllChampions();
        res.json(champions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/champion-id/:champion_id', async (req, res) => {
    try {
        const champions = await Champion.getChampionById(req.params.champion_id);
        res.json(champions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/champion-name/:champion_name', async (req, res) => {
    try {
        const champions = await Champion.getChampionByChampionName(req.params.champion_name);
        res.json(champions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  GET - Obtenir tous les champions joués par un invocateur
// pas utilisé
router.get('/summoner/:region/:summonerName', async (req, res) => {
    try {
        const champions = await Champion.getChampionsBySummoner(req.body.region, req.body.summonerName);
        res.json(champions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  GET - Obtenir les statistiques d’un champion spécifique pour un invocateur
// pas utilisé

router.get('/summoner/:region/:summonerName/:championId', async (req, res) => {
    try {
        const stats = await Champion.getChampionStats(req.params.region, req.params.summonerName, req.params.championId);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  GET - Obtenir le KDA moyen par champion pour un invocateur
// pas utilisé

router.get('/summoner/:region/:summonerName/kda', async (req, res) => {
    try {
        const kdaStats = await Champion.getChampionKDA(req.params.region, req.params.summonerName);
        res.json(kdaStats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  GET - Obtenir le taux de victoire par champion pour un invocateur
// pas utilisé

router.get('/summoner/:region/:summonerName/winrate', async (req, res) => {
    try {
        const winrate = await Champion.getChampionWinrate(req.params.region, req.params.summonerName);
        res.json(winrate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  POST - Créer un champion
router.post('/', async (req, res) => {
    try {
        const newChampion = await Champion.createChampion(req.body);
        res.json(newChampion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  PUT - Mettre à jour un champion (remplace toutes les données)
router.put('/:champion_id', async (req, res) => {
    try {
        const updatedChampion = await Champion.updateChampion(req.params.champion_id, req.body);
        res.json(updatedChampion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  PATCH - Mettre à jour partiellement un champion
router.patch('/:champion_id', async (req, res) => {
    try {
        const existingChampion = await Champion.getChampionById(req.params.champion_id);
        if (!existingChampion) {
            return res.status(404).json({ error: "Champion non trouvé" });
        }

        // On met à jour uniquement les champs fournis dans req.body
        const updatedChampion = await Champion.updateChampion(req.params.champion_id, {
            champion_name: req.body.champion_name || existingChampion.champion_name,
            role: req.body.role || existingChampion.role,
            lore: req.body.lore || existingChampion.lore,
            champion_image: req.body.champion_image || existingChampion.champion_image
        });

        res.json(updatedChampion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  DELETE - Supprimer un champion
router.delete('/:champion_id', async (req, res) => {
    try {
        const deletedChampion = await Champion.deleteChampion(req.params.champion_id);
        res.json(deletedChampion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
