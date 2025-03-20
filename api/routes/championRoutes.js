const express = require('express');
const Champion = require('../models/champion');

const router = express.Router();


//  POST - Créer un champion
router.post('/', async (req, res) => {
    try {
        const newChampion = await Champion.createChampion(req.body);
        res.json(newChampion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  GET - Obtenir la liste complète des champions
router.get('/champions', async (req, res) => {
    try {
        const champions = await Champion.getAllChampions();
        res.json(champions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  GET - Obtenir tous les champions joués par un invocateur
router.get('/summoner/:region/:summonerName', async (req, res) => {
    try {
        const champions = await Champion.getChampionsBySummoner(req.body.region, req.body.summonerName);
        res.json(champions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  GET - Obtenir les statistiques d’un champion spécifique pour un invocateur
router.get('/summoner/:region/:summonerName/:championId', async (req, res) => {
    try {
        const stats = await Champion.getChampionStats(req.params.region, req.params.summonerName, req.params.championId);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  GET - Obtenir le KDA moyen par champion pour un invocateur
router.get('/summoner/:region/:summonerName/kda', async (req, res) => {
    try {
        const kdaStats = await Champion.getChampionKDA(req.params.region, req.params.summonerName);
        res.json(kdaStats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  GET - Obtenir le taux de victoire par champion pour un invocateur
router.get('/summoner/:region/:summonerName/winrate', async (req, res) => {
    try {
        const winrate = await Champion.getChampionWinrate(req.params.region, req.params.summonerName);
        res.json(winrate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  PUT - Mettre à jour un champion (remplace toutes les données)
router.put('/:id', async (req, res) => {
    try {
        const updatedChampion = await Champion.updateChampion(req.params.id, req.body);
        res.json(updatedChampion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  PATCH - Mettre à jour partiellement un champion
router.patch('/:id', async (req, res) => {
    try {
        const existingChampion = await Champion.getChampionStats(req.body.region, req.body.summonerName, req.params.id);
        if (!existingChampion) {
            return res.status(404).json({ error: "Champion non trouvé" });
        }

        const updatedChampion = await Champion.updateChampion(req.params.id, {
            championName: req.body.championName || existingChampion.champion_name,
            role: req.body.role || existingChampion.role,
            lore: req.body.lore || existingChampion.lore,
            championImage: req.body.championImage || existingChampion.champion_image
        });

        res.json(updatedChampion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  DELETE - Supprimer un champion
router.delete('/:id', async (req, res) => {
    try {
        const deletedChampion = await Champion.deleteChampion(req.params.id);
        res.json(deletedChampion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
