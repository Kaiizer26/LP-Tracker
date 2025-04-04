const { Pool } = require('pg');
require('dotenv').config();

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
        return result.rows[0];
    }

     static async getUserById(user_id) {
        const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);
        return result.rows[0];
    }

    static async getUserByEmail(email) {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];  // Retourne l'utilisateur si trouvé
    };

    static async createUser({ username, user_image, email, password }) {
        const result = await pool.query(
            'INSERT INTO users (username, user_image, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
            [username, user_image, email, password]
        );
        return result.rows[0];
    }

    static async updateUser(user_id, { username, user_image, email, password }) {
        const result = await pool.query(
            `UPDATE users 
             SET username = $1, user_image = $2, email = $3, password = $4 
             WHERE user_id = $5
             RETURNING *`,
            [username, user_image, email, password, user_id]
        );
        return result.rows[0];
    }

    // Suppression d'un utilisateur
    static async deleteUser(user_id) {
        const result = await pool.query(
            'DELETE FROM users WHERE user_id = $1 RETURNING *',
            [user_id]
        );
        return result.rows[0];
    }
}

module.exports = User;
