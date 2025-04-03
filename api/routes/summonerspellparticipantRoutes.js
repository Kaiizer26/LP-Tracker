const express = require('express');
const SummonerSpellParticipant = require('../models/summonerspellparticipant');

const router = express.Router();
// Endpoints for matches

// Match participant (stat d'un match d'un seul joueur)

router.get('/', async (req, res) => {
    try {
        const summonerspellsparticipants = await SummonerSpellParticipant.getAllSummonerSpellsParticipants();
        summonerspellsparticipants ? res.status(200).json(summonerspellsparticipants) : res.status(404).json({ message: "Not found" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/:summoner_spell_participant_id', async (req, res) => {
    try {
        const summonerspellparticipant = await SummonerSpellParticipant.getSummonerSpellParticipantById(req.params.summoner_spell_participant_id);
        summonerspellparticipant ? res.status(200).json(summonerspellparticipant) : res.status(404).json({ message: "Not found" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newSummonerSpellParticipant = await SummonerSpellParticipant.createSummonerSpellParticipant(req.body);
        res.status(201).json(newSummonerSpellParticipant);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:summoner_spell_participant_id', async (req, res) => {
    try {
        const updatedSummonerSpellParticipant = await SummonerSpellParticipant.updateSummonerSpellParticipant(req.params.summoner_spell_participant_id, req.body);
        res.status(200).json(updatedSummonerSpellParticipant);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/:summoner_spell_participant_id', async (req, res) => {
    try {
        const existingSummonerSpellParticipant = await SummonerSpellParticipant.getSummonerSpellParticipantById(req.params.summoner_spell_participant_id);
        if (!existingSummonerSpellParticipant) {
            return res.status(404).json({ error: "Match non trouvée" });
        }

        // On met à jour uniquement les champs fournis dans req.body
        const updatedSummonerSpellParticipant= await SummonerSpellParticipant.updateSummonerSpellParticipant(req.params.summoner_spell_participant_id, {
            summoner_spell1_id: req.body.summoner_spell1_id || existingSummonerSpellParticipant.summoner_spell1_id,
            summoner_spell2_id: req.body.summoner_spell2_id || existingSummonerSpellParticipant.summoner_spell2_id
        });

        res.json(updatedSummonerSpellParticipant);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:summoner_spell_participant_id', async (req, res) => {
    try {
        await SummonerSpellParticipant.deleteSummonerSpellParticipant(req.params.summoner_spell_participant_id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router