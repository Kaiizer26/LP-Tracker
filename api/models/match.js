const { Pool} = require('pg');
require('dotenv').config();

const pool = new Pool ({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
})

class Match {
    static async getRecentMatchesBySummonerId(summonerId) {
        const result = await pool.query(
            'SELECT * FROM matches WHERE summoner_id = $1 ORDER BY created_at DESC LIMIT 10',
            [summonerId]
        );
        return result.rows;
    }


    static async getAllMatches() {
        const result = await pool.query('SELECT * FROM matches');
        return result.rows;
    }
    static async getRecentMatchesBySummonerId(summoner_id) {
        const result = await pool.query('SELECT * FROM matches WHERE summoner_id = $1', [summoner_id]);
        return result.rows;
    }
    static async getMatchById(match_id) {
        const result = await pool.query('SELECT * FROM matches WHERE match_id = $1', [match_id]);
        return result.rows[0];
    }

    static async createMatch({ match_name, game_duration, start_time, result, game_type, winning_team_side }) {
        const results = await pool.query(
            'INSERT INTO matches (match_name, game_duration, start_time, result, game_type, winning_team_side) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [match_name, game_duration, start_time, result, game_type, winning_team_side]
        );
        
        return results.rows[0];
    }

    static async updateMatch(match_id, { match_name, game_duration, start_time, end_time, result, game_type, winning_team_side }) {
        const results = await pool.query(
            'UPDATE matches SET match_name = $1, game_duration = $2, start_time = $3, end_time = $4, result = $5, game_type = $6, winning_team_side = $7 WHERE match_id = $8 RETURNING *',
            [match_name, game_duration, start_time, end_time, result, game_type, winning_team_side, match_id]
        );
        return results.rows[0];
    }

    static async deleteMatch(match_id) {
        await pool.query('DELETE FROM matches WHERE match_id = $1', [match_id]);
    }
    // Match participant
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
            'UPDATE match_participants SET match_id = $1, summoner_id = $2, team_id = $3, kills = $4, deaths = $5, assists = $6, gold_earned = $7, role = $8 WHERE id = $9 RETURNING *',
            [match_id, summoner_id, team_id, kills, deaths, assists, gold_earned, role, participant_id]
        );
        return result.rows[0];
    }

    
    static async deleteMatchParticipant(participant_id) {
        await pool.query('DELETE FROM match_participants WHERE participant_id = $1', [participant_id]);
    }
}

module.exports = Match;