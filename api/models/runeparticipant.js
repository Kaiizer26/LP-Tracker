const { Pool} = require('pg');
require('dotenv').config();

const pool = new Pool ({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
})

class RuneParticipant {
    

    

    static async getAllRunesParticipants(){
        const result = await pool.query('SELECT * FROM runes_participants');
        return result.rows;
    }

    static async createRuneParticipant({ rune1_id, rune2_id }) {
        const result = await pool.query(
            'INSERT INTO runes_participants (rune1_id, rune2_id) VALUES ($1, $2) RETURNING *',
            [rune1_id, rune2_id]
        );
        
        return result.rows[0];
    }
    
    static async getRuneParticipantById(rune_participant_id) {
        const result = await pool.query('SELECT * FROM runes_participants WHERE rune_participant_id = $1', [rune_participant_id]);
        return result.rows[0];
    }
    
    static async getRuneNamesByParticipantId(runes_participant_id) {
        try {
            const result = await pool.query(
                `SELECT 
                    r1.rune_name AS primary_rune_name,
                    r2.rune_name AS secondary_rune_name
                 FROM runes_participants rp
                 INNER JOIN runes r1 ON rp.rune1_id = r1.rune_id
                 INNER JOIN runes r2 ON rp.rune2_id = r2.rune_id
                 WHERE rp.runes_participant_id = $1`,
                [runes_participant_id]
            );
            return result.rows[0];
        } catch (error) {
            console.error("Error in getRuneNamesByParticipantId:", error);
            throw error;
        }
    }

    static async updateRuneParticipant(rune_participant_id, { rune1_id, rune2_id }) {
        const result = await pool.query(
            'UPDATE runes_participants SET rune1_id = $1, rune2_id = $2 WHERE rune_participant_id = $3 RETURNING *',
            [rune1_id, rune2_id, rune_participant_id]
        );
        return result.rows[0];
    }

    
    static async deleteRuneParticipant(rune_participant_id) {
        await pool.query('DELETE FROM runes_participants WHERE rune_participant_id = $1', [rune_participant_id]);
    }
}

module.exports = RuneParticipant;