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

    // Essai
    static async getItemsByParticipantId(item_participant_id) {
        const result = await pool.query(
            `SELECT 
                i1.item_name AS item1_name,
                i2.item_name AS item2_name,
                i3.item_name AS item3_name,
                i4.item_name AS item4_name,
                i5.item_name AS item5_name,
                i6.item_name AS item6_name,
                i7.item_name AS item_vision_name
             FROM items_participants ip
             INNER JOIN items i1 ON ip.item1_id = i1.item_id
             INNER JOIN items i2 ON ip.item2_id = i2.item_id
             INNER JOIN items i3 ON ip.item3_id = i3.item_id
             INNER JOIN items i4 ON ip.item4_id = i4.item_id
             INNER JOIN items i5 ON ip.item5_id = i5.item_id
             INNER JOIN items i6 ON ip.item6_id = i6.item_id
             INNER JOIN items i7 ON ip.item_vision_id = i7.item_id
             WHERE ip.item_participant_id = $1`,
            [item_participant_id]
        );
        return result.rows[0]; // Retourne les noms des deux summoner spells
    }


    // cop
    static async getItemsByMatchParticipantId(match_participant_id) {
        try {
            const result = await pool.query(
                `SELECT 
                    i1.item_name AS item1_name,
                    i2.item_name AS item2_name,
                    i3.item_name AS item3_name,
                    i4.item_name AS item4_name,
                    i5.item_name AS item5_name,
                    i6.item_name AS item6_name,
                    i7.item_name AS item_vision_name
                 FROM match_participants mp
                 INNER JOIN items_participants ip ON mp.item_participant_id = ip.item_participant_id
                 LEFT JOIN items i1 ON ip.item1_id = i1.item_id
                 LEFT JOIN items i2 ON ip.item2_id = i2.item_id
                 LEFT JOIN items i3 ON ip.item3_id = i3.item_id
                 LEFT JOIN items i4 ON ip.item4_id = i4.item_id
                 LEFT JOIN items i5 ON ip.item5_id = i5.item_id
                 LEFT JOIN items i6 ON ip.item6_id = i6.item_id
                 LEFT JOIN items i7 ON ip.item_vision_id = i7.item_id
                 WHERE mp.participant_id = $1`,
                [match_participant_id]
            );
            return result.rows[0]; // Retourne les noms des items
        } catch (error) {
            console.error("Error in getItemsByMatchParticipantId:", error);
            throw error;
        }
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