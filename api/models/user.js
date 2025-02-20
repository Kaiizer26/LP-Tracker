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
    static async getUserBySummonerName(summonerName) {
        const result = await pool.query('SELECT * FROM users WHERE summoner_name = $1', [summonerName]);
        return result.rows[0];
    }

    static async getRankedStats(summonerId) {
        const result = await pool.query('SELECT * FROM ranked_stats WHERE summoner_id = $1', [summonerId]);
        return result.rows[0];
    }

    static async getFlexStats(summonerId) {
        const result = await pool.query('SELECT * FROM flex_stats WHERE summoner_id = $1', [summonerId]);
        return result.rows[0];
    }

    static async getNormalStats(summonerId) {
        const result = await pool.query('SELECT * FROM normal_stats WHERE summoner_id = $1', [summonerId]);
        return result.rows[0];
    }

    static async getMastery(summonerId) {
        const result = await pool.query('SELECT * FROM champion_mastery WHERE summoner_id = $1', [summonerId]);
        return result.rows;
    }

    static async getTopMastery(summonerId) {
        const result = await pool.query('SELECT * FROM champion_mastery WHERE summoner_id = $1 ORDER BY mastery_points DESC LIMIT 3', [summonerId]);
        return result.rows;
    }

    static async getChampionMastery(summonerId, championId) {
        const result = await pool.query('SELECT * FROM champion_mastery WHERE summoner_id = $1 AND champion_id = $2', [summonerId, championId]);
        return result.rows[0];
    }

    static async getClashInfo(summonerId) {
        const result = await pool.query('SELECT * FROM clash_info WHERE summoner_id = $1', [summonerId]);
        return result.rows[0];
    }

    static async getUserLevel(summonerId) {
        const result = await pool.query('SELECT level FROM users WHERE id = $1', [summonerId]);
        return result.rows[0];
    }

    static async getUserIcon(summonerId) {
        const result = await pool.query('SELECT profile_icon FROM users WHERE id = $1', [summonerId]);
        return result.rows[0];
    }
}

module.exports = User;