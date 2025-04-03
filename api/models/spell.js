const { Pool} = require('pg');
require('dotenv').config();

const pool = new Pool ({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
})

class Spell {
    static async getAllSpells(){
        const result = await pool.query('SELECT * FROM spell');
        return result.rows;
    }

    static async getSpellById(spell_id){
        const result = await pool.query('SELECT * FROM spell WHERE spell_id = $1', [spell_id])
        return result.rows[0]
    }

    static async createSpell({champion_id, spell_name, description, spell_image }){
        const result = await pool.query(
            'INSERT INTO spell (champion_id, spell_name, description, spell_image) VALUES ($1, $2, $3, $4) RETURNING *', [champion_id, spell_name, description, spell_image ]
        )
    return result.rows[0];
    }

    static async updateSpell(spell_id, {champion_id, spell_name, description, spell_image}){
        const result = await pool.query(
            'UPDATE spell SET champion_id = $1, spell_name = $2, description = $3, spell_image = $4, spell_id = $5 RETURNING *', [champion_id, spell_name, description, spell_image, spell_id]
        )
    }

    static async deleteSpell(spell_id){
        await pool.query('DELETE FROM spell WHERE spell_id = $1', [spell_id]);
    }
}

module.exports = Spell;