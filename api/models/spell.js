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
        const result = await pool.query('SELECT * FROM spells');
        return result.rows;
    }

    static async getSpellById(spell_id){
        const result = await pool.query('SELECT * FROM spells WHERE spell_id = $1', [spell_id])
        return result.rows[0]
    }

    static async createSpell({champion_id, spell_name, description }){
        const result = await pool.query(
            'INSERT INTO spells (champion_id, spell_name, description) VALUES ($1, $2, $3) RETURNING *', [champion_id, spell_name, description ]
        )
    return result.rows[0];
    }

    static async updateSpell(spell_id, {champion_id, spell_name, description}){
        const result = await pool.query(
            'UPDATE spells SET champion_id = $1, spell_name = $2, description = $3, spell_id = $4 RETURNING *', [champion_id, spell_name, description, spell_id]
        )
    }

    static async deleteSpell(spell_id){
        await pool.query('DELETE FROM spells WHERE spell_id = $1', [spell_id]);
    }
}

module.exports = Spell;