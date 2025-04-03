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

    static async createMatch({ game_duration, start_time, game_type, winning_team_side }) {
        const results = await pool.query(
            'INSERT INTO matches (game_duration, start_time, game_type, winning_team_side) VALUES ($1, $2, $3, $4) RETURNING *',
            [game_duration, start_time, game_type, winning_team_side]
        );
        
        return results.rows[0];
    }

    static async updateMatch(match_id, {game_duration, start_time, game_type, winning_team_side }) {
        const results = await pool.query(
            'UPDATE matches SET game_duration = $1, start_time = $2, game_type = $3, winning_team_side = $4 WHERE match_id = $5 RETURNING *',
            [game_duration, start_time, game_type, winning_team_side, match_id]
        );
        return results.rows[0];
    }

    static async deleteMatch(match_id) {
        await pool.query('DELETE FROM matches WHERE match_id = $1', [match_id]);
    }
    
}

module.exports = Match;