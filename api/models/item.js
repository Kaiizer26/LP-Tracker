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
    static async getAllItems(){
        const result = await pool.query('SELECT * FROM items');
        return result.rows;
    }

    static async getItemById(item_id){
        const result = await pool.query('SELECT * FROM items WHERE item_id = $1', [item_id])
        return result.rows[0]
    }

    static async createItem({item_name, description, price}){
        const result = await pool.query(
            'INSERT INTO items (item_name, description, price) VALUES ($1, $2, $3) RETURNING *', [item_name, description, price]
        )
    return result.rows[0];
    }

    static async updateItem(item_id, {item_name, description, price}){
        const result = await pool.query(
            'UPDATE items SET item_name = $1, description = $2, price = $3 WHERE item_id = $4 RETURNING *', [item_name, description, price, item_id]
        )
    }

    static async deleteItem(item_id){
        await pool.query('DELETE FROM items WHERE item_id = $1', [item_id]);
    }
}

module.exports = Item;