const express = require('express');
const Match = require('../models/match');

const router = express.Router();
// Endpoints for matches
router.get('/', async (req, res) => {
    try {
        const match = await Match.getAllMatches();
        match ? res.status(200).json(match) : res.status(404).json(match);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('summonerId/:summoner_id', async (req, res) => {
    try {
        const match = await Match.getRecentMatchesBySummonerId(req.params.summoner_id);
        match ? res.status(200).json(match) : res.status(404).json(match);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:match_id', async (req, res) => {
    try {
        const match = await Match.getMatchById(req.params.match_id);
        match ? res.status(200).json(match) : res.status(404).json(match);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newMatch = await Match.createMatch(req.body);
        res.status(201).json(newMatch);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:match_id', async (req, res) => {
    try {
        const updatedMatch = await Match.updateMatch(req.params.match_id, req.body);
        res.status(200).json(updatedMatch);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/:match_id', async (req, res) => {
    try {
        const existingMatch = await Match.getMatchById(req.params.match_id);
        if (!existingMatch) {
            return res.status(404).json({ error: "Match non trouvée" });
        }

        // On met à jour uniquement les champs fournis dans req.body
        const updatedMatch= await Match.updateMatch(req.params.match_id, {
            match_name: req.body.match_name || existingMatch.match_name,
            game_duration: req.body.game_duration || existingMatch.game_duration,
            start_time: req.body.start_time || existingMatch.start_time,
            result: req.body.result || existingMatch.result,
            game_type: req.body.game_type || existingMatch.game_type,
            winning_team_side: req.body.winning_team_side || existingMatch.winning_team_side

        });

        res.json(updatedMatch);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:match_id', async (req, res) => {
    try {
        await Match.deleteMatch(req.params.match_id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Match participant (stat d'un match d'un seul joueur)

router.get('/matchparticipant/:participant_id', async (req, res) => {
    try {
        const matchparticipant = await Match.getMatchById(req.params.participant_id);
        matchparticipant ? res.status(200).json(matchparticipant) : res.status(404).json({ message: "Not found" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/matchparticipant', async (req, res) => {
    try {
        const newMatchParticipant = await Match.createMatchParticipant(req.body);
        res.status(201).json(newMatchParticipant);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/matchparticipant/:id', async (req, res) => {
    try {
        const updatedMatch = await Match.updateMatchParticipant(req.params.participant_id, req.body);
        res.status(200).json(updatedMatchParticipant);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/matchparticipant/:id', async (req, res) => {
    try {
        const updatedMatchParticipant = await Match.updateMatchParticipant(req.params.id, req.body, { partial: true });
        res.status(200).json(updatedMatchParticipant);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/matchparticipant/:id', async (req, res) => {
    try {
        await Match.deleteMatchParticipant(req.params.participant_id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router