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
// 📌 Obtenir un aperçu global des statistiques d'un joueur
// router.get('/summoners/:region/:summonerName/stats/overview', async (req, res) => {
//     try {
//         const stats = await Statistique.getStatsOverview(req.params.region, req.params.summonerName);
//         res.json(stats);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // 📌 Obtenir le KDA global
// router.get('/summoners/:region/:summonerName/stats/kda', async (req, res) => {
//     try {
//         const kda = await Statistique.getKDA(req.params.region, req.params.summonerName);
//         res.json(kda);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // 📌 Obtenir le taux de victoire global
// router.get('/summoners/:region/:summonerName/stats/winrate', async (req, res) => {
//     try {
//         const winrate = await Statistique.getWinrate(req.params.region, req.params.summonerName);
//         res.json(winrate);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // 📌 Obtenir les statistiques par champion
// router.get('/summoners/:region/:summonerName/stats/champions', async (req, res) => {
//     try {
//         const statsByChampion = await Statistique.getStatsByChampion(req.params.region, req.params.summonerName);
//         res.json(statsByChampion);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // 📌 Obtenir les statistiques par rôle
// router.get('/summoners/:region/:summonerName/stats/roles', async (req, res) => {
//     try {
//         const statsByRole = await Statistique.getStatsByRole(req.params.region, req.params.summonerName);
//         res.json(statsByRole);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // 📌 Obtenir les objets les plus utilisés
// router.get('/summoners/:region/:summonerName/stats/items', async (req, res) => {
//     try {
//         const items = await Statistique.getMostUsedItems(req.params.region, req.params.summonerName);
//         res.json(items);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // 📌 Obtenir les runes les plus utilisées
// router.get('/summoners/:region/:summonerName/stats/runes', async (req, res) => {
//     try {
//         const runes = await Statistique.getMostUsedRunes(req.params.region, req.params.summonerName);
//         res.json(runes);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // 📌 Obtenir les sorts d'invocateur les plus utilisés
// router.get('/summoners/:region/:summonerName/stats/spells', async (req, res) => {
//     try {
//         const spells = await Statistique.getMostUsedSpells(req.params.region, req.params.summonerName);
//         res.json(spells);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // 📌 Obtenir les dégâts moyens infligés/subis
// router.get('/summoners/:region/:summonerName/stats/damage', async (req, res) => {
//     try {
//         const damage = await Statistique.getAverageDamage(req.params.region, req.params.summonerName);
//         res.json(damage);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // 📌 Obtenir l'or moyen gagné
// router.get('/summoners/:region/:summonerName/stats/gold', async (req, res) => {
//     try {
//         const gold = await Statistique.getAverageGold(req.params.region, req.params.summonerName);
//         res.json(gold);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

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
