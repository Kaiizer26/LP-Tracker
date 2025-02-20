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
    static async getRecentMatchesByUser(userId) {
        const result = await pool.query(
            'SELECT * FROM matches WHERE summoner_id = $1 ORDER BY created_at DESC LIMIT 10',
            [userId]
        );
        return result.rows;
    }

    static async getMatchById(id) {
        const result = await pool.query('SELECT * FROM matches WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async createMatch({ summoner_id, champion_id, kills, deaths, assists, match_duration, match_result }) {
        const result = await pool.query(
            'INSERT INTO matches (summoner_id, champion_id, kills, deaths, assists, match_duration, match_result) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [summoner_id, champion_id, kills, deaths, assists, match_duration, match_result]
        );
        
        return result.rows[0];
    }
    
    static async updateMatch(id, { team1, team2, date, score }) {
        const result = await pool.query(
            'UPDATE matches SET team1 = $1, team2 = $2, date = $3, score = $4 WHERE id = $5 RETURNING *',
            [team1, team2, date, score, id]
        );
        return result.rows[0];
    }

    static async deleteMatch(id) {
        await pool.query('DELETE FROM matches WHERE id = $1', [id]);
    }
}

module.exports = Match;