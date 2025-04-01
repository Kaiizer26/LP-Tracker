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

    // Obtenir tous les match auxquels un summoner a participé
    static async getMatchParticipantsBySummonerId(summoner_id) {
        const result = await pool.query(
            `SELECT mp.participant_id, mp.match_id, mp.team_id, mp.kills, mp.deaths, mp.assists, mp.gold_earned, mp.role, m.match_name, m.game_duration, m.game_type, m.start_time, m.result, m.winning_team_side, t.team_name, t.team_side 
            FROM match_participants mp 
            INNER JOIN matches m ON mp.match_id = m.match_id 
            INNER JOIN teams t ON mp.team_id = t.team_id 
            WHERE mp.summoner_id = $1 
            ORDER BY m.start_time DESC`, 
            [summoner_id]
        );
        return result.rows;
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