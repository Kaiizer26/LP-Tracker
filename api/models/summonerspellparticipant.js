const { Pool} = require('pg');
require('dotenv').config();

const pool = new Pool ({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
})

class SummonerSpellParticipant {
    

    

    static async getAllSummonerSpellsParticipants(){
        const result = await pool.query('SELECT * FROM summoner_spells_participants');
        return result.rows;
    }

    static async createSummonerSpellParticipant({ summoner_spell1_id, summoner_spell2_id }) {
        const result = await pool.query(
            'INSERT INTO summoner_spells_participants (summoner_spell1_id, summoner_spell2_id) VALUES ($1, $2) RETURNING *',
            [summoner_spell1_id, summoner_spell2_id]
        );
        
        return result.rows[0];
    }
    
    
    static async getSummonerSpellParticipantById(summoner_spell_participant_id) {
        const result = await pool.query('SELECT * FROM summoner_spells_participants WHERE summoner_spell_participant_id = $1', [summoner_spell_participant_id]);
        return result.rows[0];
    }
    
    static async updateSummonerSpellParticipant(summoner_spell_participant_id, {summoner_spell1_id, summoner_spell2_id}) {
        const result = await pool.query(
            'UPDATE summoner_spells_participants SET summoner_spell1_id = $1, summoner_spell2_id = $2 WHERE summoner_spell_participant_id = $3 RETURNING *',
            [summoner_spell1_id, summoner_spell2_id, summoner_spell_participant_id]
        );
        return result.rows[0];
    }

    static async getSummonerSpellNamesByParticipantId(summoner_spell_participant_id) {
        const result = await pool.query(
            `SELECT 
                s1.spell_name AS summoner_spell1_name,
                s2.spell_name AS summoner_spell2_name
             FROM summoner_spells_participants ssp
             INNER JOIN spells s1 ON ssp.summoner_spell1_id = s1.spell_id
             INNER JOIN spells s2 ON ssp.summoner_spell2_id = s2.spell_id
             WHERE ssp.summoner_spell_participant_id = $1`,
            [summoner_spell_participant_id]
        );
        return result.rows[0]; // Retourne les noms des deux summoner spells
    }

    static async deleteSummonerSpellParticipant(summoner_spell_participant_id) {
        await pool.query('DELETE FROM summoner_spells_participants WHERE summoner_spell_participant_id = $1', [summoner_spell_participant_id]);
    }
}

module.exports = SummonerSpellParticipant;