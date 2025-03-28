const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

class Rune {
    static async getAllRunes() {
        const result = await pool.query('SELECT * FROM rune');
        return result.rows;
    }

    static async getRuneById(rune_id) {
        const result = await pool.query('SELECT * FROM rune WHERE rune_id = $1', [rune_id]);
        return result.rows[0];
    }

    static async createRune({ rune_name, description }) {
        const result = await pool.query(
            'INSERT INTO rune (rune_name, description) VALUES ($1, $2) RETURNING *',
            [rune_name, description]
        );
        return result.rows[0];
    }

    static async updateRune(rune_id, { rune_name, description }) {
        const result = await pool.query(
            'UPDATE rune SET rune_name = $1, description = $2 WHERE rune_id = $3 RETURNING *',
            [rune_name, description, rune_id]
        );
        return result.rows[0];
    }

    static async deleteRune(rune_id) {
        await pool.query('DELETE FROM rune WHERE rune_id = $1', [rune_id]);
    }
}

module.exports = Rune;
