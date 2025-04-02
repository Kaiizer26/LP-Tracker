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

class User {
    static async getAllUsers() {
        const result = await pool.query('SELECT * FROM users');
        return result.rows;
    }

    static async getUserByUsername(username) {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        return result.rows[0]; // Si un utilisateur existe, il sera retourné
    }

    static async getUserByEmail(email) {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0]; // Si un utilisateur avec cet email existe, il sera retourné
    }

    static async createUser({ username, email, password }) {
        const result = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email, password]
        );
        return result.rows[0]; // Retourne l'utilisateur créé
    }

    static async updateUser(user_id, { username, email, password }) {
        const result = await pool.query(
            `UPDATE users 
             SET username = $1, email = $2, password = $3 
             WHERE user_id = $4 
             RETURNING *`,
            [username, email, password, user_id]
        );
        return result.rows[0]; // Retourne l'utilisateur mis à jour
    }

    static async deleteUser(user_id) {
        const result = await pool.query(
            'DELETE FROM users WHERE user_id = $1 RETURNING *',
            [user_id]
        );
        return result.rows[0]; // Retourne l'utilisateur supprimé
    }
}

module.exports = User;