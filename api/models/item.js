const { Pool} = require('pg');
require('dotenv').config();

const pool = new Pool ({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
})

class Item {
    // 📌 Créer un nouvel objet
    static async createItem({ itemName, description, price }) {
        const result = await pool.query(
            `INSERT INTO items (item_name, description, price, created_at, updated_at) 
             VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
             RETURNING *`,
            [itemName, description, price]
        );
        return result.rows[0]; // Retourne l'objet créé
    }

    // 📌 Récupérer tous les objets
    static async getAllItems() {
        const result = await pool.query(
            `SELECT * FROM items ORDER BY item_name ASC`
        );
        return result.rows; // Retourne tous les objets
    }

    // 📌 Récupérer un objet spécifique par son ID
    static async getItemById(itemId) {
        const result = await pool.query(
            `SELECT * FROM items WHERE item_id = $1`,
            [itemId]
        );
        return result.rows[0]; // Retourne un seul objet ou null
    }

    // 📌 Mettre à jour un objet (Met aussi à jour `updated_at` manuellement)
    static async updateItem(itemId, { itemName, description, price }) {
        const result = await pool.query(
            `UPDATE items 
             SET item_name = $1, description = $2, price = $3, updated_at = CURRENT_TIMESTAMP
             WHERE item_id = $4 
             RETURNING *`,
            [itemName, description, price, itemId]
        );
        return result.rows[0]; // Retourne l'objet mis à jour
    }
// changement 
    // 📌 Supprimer un objet
    static async deleteItem(itemId) {
        const result = await pool.query(
            `DELETE FROM items WHERE item_id = $1 RETURNING *`,
            [itemId]
        );
        return result.rows[0]; // Retourne l'objet supprimé
    }
}

module.exports = Item;