const { Pool } = require('pg');
require('dotenv').config();

// Configuration de la connexion à la base de données PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

class Rune {
    // Récupérer toutes les runes
    static async getAllRunes() {
        const result = await pool.query('SELECT * FROM runes');
        return result.rows;
    }

    // Récupérer une rune par son ID
    static async getRuneById(rune_id) {
        const result = await pool.query('SELECT * FROM runes WHERE rune_id = $1', [rune_id]);
        return result.rows[0];
    }

    // Créer une nouvelle rune
    static async createRune({ rune_name, description }) {
        const result = await pool.query(
            'INSERT INTO runes (rune_name, description) VALUES ($1, $2) RETURNING *',
            [rune_name, description]
        );
        return result.rows[0];
    }

    // Mettre à jour une rune existante
    static async updateRune(rune_id, { rune_name,  description }) {
        const result = await pool.query(
            'UPDATE runes SET rune_name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE rune_id = $3 RETURNING *',
            [rune_name, description, rune_id]
        );
        return result.rows[0];
    }

    // Supprimer une rune par son ID
    static async deleteRune(rune_id) {
        const result = await pool.query('DELETE FROM runes WHERE rune_id = $1 RETURNING *', [rune_id]);
        return result.rows[0]; // Retourne la rune supprimée
    }
}

module.exports = Rune;
