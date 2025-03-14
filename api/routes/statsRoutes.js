const express = require('express');
const Statistique = require('../models/stats');

const router = express.Router();

// 📌 Obtenir un aperçu global des statistiques d'un joueur
router.get('/summoners/:region/:summonerName/stats/overview', async (req, res) => {
    try {
        const stats = await Statistique.getStatsOverview(req.params.region, req.params.summonerName);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Obtenir le KDA global
router.get('/summoners/:region/:summonerName/stats/kda', async (req, res) => {
    try {
        const kda = await Statistique.getKDA(req.params.region, req.params.summonerName);
        res.json(kda);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Obtenir le taux de victoire global
router.get('/summoners/:region/:summonerName/stats/winrate', async (req, res) => {
    try {
        const winrate = await Statistique.getWinrate(req.params.region, req.params.summonerName);
        res.json(winrate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Obtenir les statistiques par champion
router.get('/summoners/:region/:summonerName/stats/champions', async (req, res) => {
    try {
        const statsByChampion = await Statistique.getStatsByChampion(req.params.region, req.params.summonerName);
        res.json(statsByChampion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Obtenir les statistiques par rôle
router.get('/summoners/:region/:summonerName/stats/roles', async (req, res) => {
    try {
        const statsByRole = await Statistique.getStatsByRole(req.params.region, req.params.summonerName);
        res.json(statsByRole);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Obtenir les objets les plus utilisés
router.get('/summoners/:region/:summonerName/stats/items', async (req, res) => {
    try {
        const items = await Statistique.getMostUsedItems(req.params.region, req.params.summonerName);
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Obtenir les runes les plus utilisées
router.get('/summoners/:region/:summonerName/stats/runes', async (req, res) => {
    try {
        const runes = await Statistique.getMostUsedRunes(req.params.region, req.params.summonerName);
        res.json(runes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Obtenir les sorts d'invocateur les plus utilisés
router.get('/summoners/:region/:summonerName/stats/spells', async (req, res) => {
    try {
        const spells = await Statistique.getMostUsedSpells(req.params.region, req.params.summonerName);
        res.json(spells);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Obtenir les dégâts moyens infligés/subis
router.get('/summoners/:region/:summonerName/stats/damage', async (req, res) => {
    try {
        const damage = await Statistique.getAverageDamage(req.params.region, req.params.summonerName);
        res.json(damage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Obtenir l'or moyen gagné
router.get('/summoners/:region/:summonerName/stats/gold', async (req, res) => {
    try {
        const gold = await Statistique.getAverageGold(req.params.region, req.params.summonerName);
        res.json(gold);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
