const { Pool} = require('pg');
require('dotenv').config();

const pool = new Pool ({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
})

class ItemParticipant {
    

    // Obtenir tous les items d'un match auxquels un summoner a participé
    static async getItemsParticipantsBySummonerId(summoner_id) {
        const result = await pool.query(
            `SELECT ip.*
            FROM match_participants mp 
            INNER JOIN items_participants ip ON mp.item_participant_id = ip.item_participant_id 
            WHERE mp.summoner_id = $1`, 
            [summoner_id]
        );
        return result.rows;
    }

    static async getAllItemsParticipants(){
        const result = await pool.query('SELECT * FROM items_participants');
        return result.rows;
    }

    static async createItemParticipant({ item1_id, item2_id, item3_id, item4_id, item5_id, item6_id, item_vision_id }) {
        const result = await pool.query(
            'INSERT INTO match_participants (item1_id, item2_id, item3_id, item4_id, item5_id, item6_id, item_vision_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [item1_id, item2_id, item3_id, item4_id, item5_id, item6_id, item_vision_id]
        );
        
        return result.rows[0];
    }
    
    static async getItemParticipantById(item_participant_id) {
        const result = await pool.query('SELECT * FROM items_participants WHERE item_participant_id = $1', [item_participant_id]);
        return result.rows[0];
    }
    
    static async updateMatchParticipant(item_participant_id, { item1_id, item2_id, item3_id, item4_id, item5_id, item6_id, item_vision_id }) {
        const result = await pool.query(
            'UPDATE items_participants SET item1_id = $1, item2_id = $2, item3_id = $3, item4_id = $4, item5_id = $5, item6_id = $6, item_vision_id = $7 WHERE item_participant_id = $8 RETURNING *',
            [item1_id, item2_id, item3_id, item4_id, item5_id, item6_id, item_vision_id, item_participant_id]
        );
        return result.rows[0];
    }

    
    static async deleteMatchParticipant(item_participant_id) {
        await pool.query('DELETE FROM items_participants WHERE item_participant_id = $1', [item_participant_id]);
    }
}

module.exports = ItemParticipant;