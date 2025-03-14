const express = require('express');
const Match = require('../models/match');

const router = express.Router();
// Endpoints for matches
router.get('/matches/user/:userId', async (req, res) => {
    try {
        const matches = await Match.getRecentMatchesBySummonerId(req.params.summonerId);
        res.status(200).json(matches);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/matches/:match_id', async (req, res) => {
    try {
        const match = await Match.getMatchById(req.params.match_id);
        match ? res.status(200).json(match) : res.status(404).json({ message: "Not found" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/matches', async (req, res) => {
    try {
        const newMatch = await Match.createMatch(req.body);
        res.status(201).json(newMatch);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/matches/:id', async (req, res) => {
    try {
        const updatedMatch = await Match.updateMatch(req.params.id, req.body);
        res.status(200).json(updatedMatch);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/matches/:id', async (req, res) => {
    try {
        const updatedMatch = await Match.updateMatch(req.params.id, req.body, { partial: true });
        res.status(200).json(updatedMatch);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/matches/:id', async (req, res) => {
    try {
        await Match.deleteMatch(req.params.id);
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