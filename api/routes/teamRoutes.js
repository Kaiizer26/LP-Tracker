const express = require('express');
const Team = require('../models/team');

const router = express.Router();

// GET all teams
router.get('/', async (req, res) => {
    try {
        const teams = await Team.getAllTeams();
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET a specific team by ID
router.get('/:id', async (req, res) => {
    try {
        const team = await Team.getTeamById(req.params.id);
        team ? res.status(200).json(team) : res.status(404).json({ message: "Not found" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST a new team
router.post('/', async (req, res) => {
    try {
        const newTeam = await Team.createTeam(req.body);
        res.status(201).json(newTeam);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT to update a team by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedTeam = await Team.updateTeam(req.params.id, req.body);
        res.status(200).json(updatedTeam);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE a team by ID
router.delete('/:id', async (req, res) => {
    try {
        await Team.deleteTeam(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const existingTeam = await Team.getTeamById(req.params.id);
        if (!existingTeam) {
            return res.status(404).json({ error: "Équipe non trouvée" });
        }

        // On met à jour uniquement les champs fournis dans req.body
        const updatedTeam = await Team.updateTeam(req.params.id, {
            match_id: req.body.match_id || existingTeam.match_id,
            team_name: req.body.team_name || existingTeam.team_name,
            team_side: req.body.team_side || existingTeam.team_side
        });

        res.json(updatedTeam);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;