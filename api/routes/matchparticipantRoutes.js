const express = require('express');
const MatchParticipant = require('../models/matchparticipant');

const router = express.Router();
// Endpoints for matches

// Match participant (stat d'un match d'un seul joueur)

router.get('/', async (req, res) => {
    try {
        const matchparticipants = await MatchParticipant.getAllMatchParticipants();
        matchparticipants ? res.status(200).json(matchparticipants) : res.status(404).json({ message: "Not found" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/:participant_id', async (req, res) => {
    try {
        const matchparticipant = await MatchParticipant.getMatchParticipantById(req.params.participant_id);
        matchparticipant ? res.status(200).json(matchparticipant) : res.status(404).json({ message: "Not found" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/summoner-id/:summoner_id', async (req, res) => {
    try {
        const matchparticipant = await MatchParticipant.getMatchParticipantsBySummonerId(req.params.summoner_id);
        matchparticipant ? res.status(200).json(matchparticipant) : res.status(404).json({ message: "pas trouvé" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// problème pr l'instant, récupère le match par participant_id (c'est à dire le match d'un joueur)
router.get('/match/participant_id/:participant_id/', async (req, res) => {
    try {
        const match = await MatchParticipant.getMatchByMatchParticipantId(req.params.participant_id);
        if (match) {
            res.status(200).json(match);
        } else {
            res.status(404).json({ message: "Match not found for this participant." });
        }
    } catch (error) {
        console.error("Error fetching match by participant_id:", error);
        res.status(500).json({ error: error.message });
    }
});

// en test, récupère tous les participants d'un match
router.get('/match/:match_id/', async (req, res) => {
    try {
        const participants = await MatchParticipant.getMatchParticipantsByMatchId(req.params.match_id);
        if (participants.length > 0) {
            res.status(200).json(participants);
        } else {
            res.status(404).json({ message: "No participants found for this match." });
        }
    } catch (error) {
        console.error("Error fetching participants by match_id:", error);
        res.status(500).json({ error: error.message });
    }
}); 

router.post('/', async (req, res) => {
    try {
        const newMatchParticipant = await MatchParticipant.createMatchParticipant(req.body);
        res.status(201).json(newMatchParticipant);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:participant_id', async (req, res) => {
    try {
        const updatedMatchParticipant = await MatchParticipant.updateMatchParticipant(req.params.participant_id, req.body);
        res.status(200).json(updatedMatchParticipant);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/:matchparticipant_id', async (req, res) => {
    try {
        const existingMatchParticipant = await MatchParticipant.getMatchParticipantById(req.params.matchparticipant_id);
        if (!existingMatchParticipant) {
            return res.status(404).json({ error: "Match non trouvée" });
        }

        // On met à jour uniquement les champs fournis dans req.body
        const updatedMatchParticipant= await MatchParticipant.updateMatchParticipant(req.params.matchparticipant_id, {
            match_id: req.body.match_id || existingMatchParticipant.match_id,
            summoner_id: req.body.summoner_id || existingMatchParticipant.summoner_id,
            team_id: req.body.team_id || existingMatchParticipant.team_id,
            kills: req.body.kills || existingMatchParticipant.kills,
            deaths: req.body.deaths || existingMatchParticipant.deaths,
            assists: req.body.assists || existingMatchParticipant.assists,
            gold_earned: req.body.gold_earned || existingMatchParticipant.gold_earned,
            role: req.body.role || existingMatchParticipant.role

        });

        res.json(updatedMatchParticipant);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:participant_id', async (req, res) => {
    try {
        await MatchParticipant.deleteMatchParticipant(req.params.participant_id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router