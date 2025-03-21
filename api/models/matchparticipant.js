const { Pool} = require('pg');
require('dotenv').config();

const pool = new Pool ({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
})

class MatchParticipant {
    
    static async getMatchParticipantsByMatchId() {

    }
    static async getAllMatchParticipants(){
        const result = await pool.query('SELECT * FROM match_participants');
        return result.rows;
    }

    static async createMatchParticipant({ match_id, summoner_id, team_id, kills, deaths, assists, gold_earned, role }) {
        const result = await pool.query(
            'INSERT INTO match_participants (match_id, summoner_id, team_id, kills, deaths, assists, gold_earned, role) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [match_id, summoner_id, team_id, kills, deaths, assists, gold_earned, role]
        );
        
        return result.rows[0];
    }
    
    static async getMatchParticipantById(participant_id) {
        const result = await pool.query('SELECT * FROM match_participants WHERE participant_id = $1', [participant_id]);
        return result.rows[0];
    }
    
    static async updateMatchParticipant(participant_id, { match_id, summoner_id, team_id, kills, deaths, assists, gold_earned, role }) {
        const result = await pool.query(
            'UPDATE match_participants SET match_id = $1, summoner_id = $2, team_id = $3, kills = $4, deaths = $5, assists = $6, gold_earned = $7, role = $8 WHERE participant_id = $9 RETURNING *',
            [match_id, summoner_id, team_id, kills, deaths, assists, gold_earned, role, participant_id]
        );
        return result.rows[0];
    }

    
    static async deleteMatchParticipant(participant_id) {
        await pool.query('DELETE FROM match_participants WHERE participant_id = $1', [participant_id]);
    }
}

module.exports = MatchParticipant;