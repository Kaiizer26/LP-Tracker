const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

class Summoner {

     static async getAllSummoners() {
        const result = await pool.query('SELECT * FROM summoners');
        return result.rows;
    }
     static async getSummonerBySummonerName(summonerName) {
        const result = await pool.query('SELECT * FROM summoners WHERE summoner_name = $1', [summonerName]);
        return result.rows[0];
    }
     static async getSummonerById(summonerId) {
        const result = await pool.query('SELECT * FROM summoners WHERE summoner_id = $1', [summonerId]);
        return result.rows[0];
    }

    // à modifier/attendre car pas de model stats encore
    static async getRankedStats(summonerId) {
        const result = await pool.query('SELECT * FROM stats WHERE summoner_id = $1', [summonerId]);
        return result.rows[0];
    }
    // en attendant
    static async getRankedStats(summonerId) {
        const result = await pool.query('SELECT ranked_division, lp FROM summoners WHERE summoner_id = $1', [summonerId]);
        return result.rows[0];
    }

    /*static async getFlexStats(summonerId) {
        const result = await pool.query('SELECT * FROM flex_stats WHERE summoner_id = $1', [summonerId]);
        return result.rows[0];
    }
    */

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

    static async getSummonerLevel(summonerId) {
        const result = await pool.query('SELECT summoner_level FROM summoners WHERE summoner_id = $1', [summonerId]);
        return result.rows[0];
    }

    static async getSummonerIcon(summonerId) {
        const result = await pool.query('SELECT profile_icon_id FROM summoners WHERE summoner_id = $1', [summonerId]);
        return result.rows[0];
    }

    static async createSummoner({ summoner_name, region, summoner_level, summoner_icon_id, puuid }) {
        const result = await pool.query(
            'INSERT INTO summoners (summoner_name, region, summoner_level, summoner_icon_id, puuid) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [summoner_name, region, summoner_level, summoner_icon_id, puuid]
        );
        return result.rows[0];
    }
    static async updateSummoner(summoner_id, { summoner_name, region, summoner_level, summoner_icon_id, puuid}) {
        const result = await pool.query(
            `UPDATE summoners 
             SET summoner_name = $1, region = $2, summoner_level = $3, summoner_icon_id = $4, puuid = $5 WHERE summoner_id = $8 
             RETURNING *`,
            [summoner_name, region, summoner_level, summoner_icon_id, puuid, summoner_id]
        );
        return result.rows[0];
    }

    // Suppression d'un invocateur
    static async deleteSummoner(summoner_id) {
        const result = await pool.query(
            'DELETE FROM summoners WHERE summoner_id = $1 RETURNING *',
            [summoner_id]
        );
        return result.rows[0];
    }

    static async searchSummonerByName(name) {
        const result = await pool.query(
            `SELECT * FROM summoners 
             WHERE summoner_name ILIKE $1`,  // ILIKE permet une recherche insensible à la casse
            [`%${name}%`]  // Le % permet de rechercher une sous-chaîne
        );
        return result.rows;
    }
}


module.exports = Summoner;