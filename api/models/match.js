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
            'SELECT * FROM matches WHERE user_id = $1 ORDER BY date DESC LIMIT 10',
            [userId]
        );
        return result.rows;
    }

    static async getMatchById(id) {
        const result = await pool.query('SELECT * FROM matches WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async createMatch({ team1, team2, date, score }) {
        const result = await pool.query(
            'INSERT INTO matches (team1, team2, date, score) VALUES ($1, $2, $3, $4) RETURNING *',
            [team1, team2, date, score]
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