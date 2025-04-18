const { Pool} = require('pg');
require('dotenv').config();

const pool = new Pool ({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
})

class ChampionMastery {
    


    static async getAllChampionsMasteries() {
        const result = await pool.query('SELECT * FROM champion_masteries');
        return result.rows;
    }
    static async getChampionMasteryById(champion_mastery_id) {
        const result = await pool.query('SELECT * FROM champion_masteries WHERE champion_mastery_id = $1', [champion_mastery_id]);
        return result.rows[0];
    }
    static async getChampionMasteriesBySummonerId(summoner_id) {
        const result = await pool.query('SELECT * FROM champion_masteries WHERE summoner_id = $1', [summoner_id]);
        return result.rows;
    }
    static async getChampionMasteriesByChampionId(champion_id) {
        const result = await pool.query('SELECT * FROM champion_masteries WHERE champion_id = $1', [champion_id]);
        return result.rows[0];
    }
    static async getMasteryLevelByChampionMasteryId(champion_mastery_id) {
        const result = await pool.query('SELECT mastery_level FROM champion_masteries WHERE champion_mastery_id = $1', [champion_mastery_id]);
        return result.rows[0];
    }
    
    static async getMasteryPointsByChampionMasteryId(champion_mastery_id) {
        const result = await pool.query('SELECT mastery_points FROM champion_masteries WHERE champion_mastery_id = $1', [champion_mastery_id]);
        return result.rows[0];
    }

    static async createChampionMastery({ summoner_id, champion_id, mastery_level, mastery_points, number_of_games, kills, deaths, assists, kda, wins, losses, winrate, lp }) {
        const results = await pool.query(
            'INSERT INTO champion_masteries (summoner_id, champion_id, mastery_level, mastery_points, number_of_games, kills, deaths, assists, kda, wins, losses, winrate, lp) VALUES ($1, $2, $3, $4) RETURNING *',
            [summoner_id, champion_id, mastery_level, mastery_points, number_of_games, kills, deaths, assists, kda, wins, losses, winrate, lp]
        );
        
        return results.rows[0];
    }

    static async updateChampionMastery(champion_mastery_id, { summoner_id, champion_id, mastery_level, mastery_points, number_of_games, kills, deaths, assists, kda, wins, losses, winrate, lp }) {
        const results = await pool.query(
            'UPDATE champion_masteries SET summoner_id =$1, champion_id = $2, mastery_level = $3, mastery_points = $4, number_of_games =$5, kills =$6, deaths =$7, assists =$8, kda =$9, wins =$10, losses =$11, winrate =$12, lp =$13 WHERE champion_mastery_id = $14 RETURNING *',
            [summoner_id, champion_id, mastery_level, mastery_points, number_of_games, kills, deaths, assists, kda, wins, losses, winrate, lp, champion_mastery_id]
        );
        return results.rows[0];
    }

    static async deleteChampionMastery(champion_mastery_id) {
        await pool.query('DELETE FROM champion_masteries WHERE champion_mastery_id = $1', [champion_mastery_id]);
    }
    
}

module.exports = ChampionMastery;