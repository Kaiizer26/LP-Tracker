const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

class Friend {
    // Obtenir toutes les relations d'un utilisateur (amis + demandes)
    static async getFriendsOfUser(user_id) {
        const result = await pool.query(
            `SELECT * FROM friends 
             WHERE user_id1 = $1 OR user_id2 = $1`,
            [user_id]
        );
        return result.rows;
    }

    // Obtenir une relation spécifique entre deux utilisateurs
    static async getFriendship(user_id1, user_id2) {
        const result = await pool.query(
            `SELECT * FROM friends 
             WHERE (user_id1 = $1 AND user_id2 = $2) 
             OR (user_id1 = $2 AND user_id2 = $1)`,
            [user_id1, user_id2]
        );
        return result.rows[0];
    }

    // Créer une demande d'ami
    static async sendFriendRequest(user_id1, user_id2) {
        const result = await pool.query(
            `INSERT INTO friends (user_id1, user_id2) 
             VALUES ($1, $2) RETURNING *`,
            [user_id1, user_id2]
        );
        return result.rows[0];
    }

    // Mettre à jour le statut d'une relation (accepter ou bloquer par ex)
    static async updateFriendStatus(user_id1, user_id2, status) {
        const result = await pool.query(
            `UPDATE friends SET status = $1 
             WHERE (user_id1 = $2 AND user_id2 = $3) 
             OR (user_id1 = $3 AND user_id2 = $2) 
             RETURNING *`,
            [status, user_id1, user_id2]
        );
        return result.rows[0];
    }

    // Supprimer une relation
    static async deleteFriendship(user_id1, user_id2) {
        await pool.query(
            `DELETE FROM friends 
             WHERE (user_id1 = $1 AND user_id2 = $2) 
             OR (user_id1 = $2 AND user_id2 = $1)`,
            [user_id1, user_id2]
        );
    }
}

module.exports = Friend;
