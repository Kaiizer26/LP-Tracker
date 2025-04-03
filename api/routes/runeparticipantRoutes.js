const express = require("express");
const RuneParticipant = require("../models/runeparticipant");

const router = express.Router();


// Match participant (stat d'un match d'un seul joueur)

router.get("/", async (req, res) => {
  try {
    const runeparticipants = await RuneParticipant.getAllRunesParticipants();
    runeparticipants
      ? res.status(200).json(runeparticipants)
      : res.status(404).json({ message: "Not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/:rune_participant_id", async (req, res) => {
  try {
    const runeparticipant = await RuneParticipant.getRuneParticipantById(
      req.params.rune_participant_id
    );
    runeparticipant
      ? res.status(200).json(runeparticipant)
      : res.status(404).json({ message: "Not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/names/:rune_participant_id", async (req, res) => {
  try {
    const runeNames = await RuneParticipant.getRuneNamesByParticipantId(
      req.params.rune_participant_id
    );
    runeNames
      ? res.status(200).json(runeNames)
      : res.status(404).json({ message: "Runes not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newRuneParticipant = await RuneParticipant.createRuneParticipant(
      req.body
    );
    res.status(201).json(newRuneParticipant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:rune_participant_id", async (req, res) => {
  try {
    const updatedRuneParticipant = await RuneParticipant.updateRuneParticipant(
      req.params.rune_participant_id,
      req.body
    );
    res.status(200).json(updatedRuneParticipant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/:rune_participant_id", async (req, res) => {
  try {
    const existingRuneParticipant =
      await RuneParticipant.getRuneParticipantById(
        req.params.rune_participant_id
      );
    if (!existingRuneParticipant) {
      return res.status(404).json({ error: "Match non trouvée" });
    }

    // On met à jour uniquement les champs fournis dans req.body
    const updatedRuneParticipant = await RuneParticipant.updateRuneParticipant(
      req.params.rune_participant_id,
      {
        rune1_id: req.body.rune1_id || existingRuneParticipant.rune1_id,
        rune2_id: req.body.rune2_id || existingRuneParticipant.rune2_id,
      }
    );

    res.json(updatedRuneParticipant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:rune_participant_id", async (req, res) => {
  try {
    await RuneParticipant.deleteRuneParticipant(req.params.rune_participant_id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
