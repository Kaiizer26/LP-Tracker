const { Pool} = require('pg');
require('dotenv').config();

const pool = new Pool ({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
})

class Statistics {

    static async getAllStats() {
        const result = await pool.query('SELECT * FROM stats');
        return result.rows;
    }
    static async getStatsById(stat_id) {
        const result = await pool.query('SELECT * FROM stats WHERE stat_id = $1', [stat_id]);
        return result.rows[0];
    }

    static async getStatsBySummonerId(summoner_id) {
        const result = await pool.query(
            `SELECT * 
             FROM stats 
             WHERE summoner_id = $1`,
            [summoner_id]
        );
        return result.rows[0]; 
    }

    static async createStats({summoner_id, region, solo_rank, flex_rank, solo_wins, solo_losses, solo_remakes, flex_wins, flex_losses, flex_remakes, kills, deaths, assists}) {
        const result = await pool.query(
            'INSERT INTO stats (summoner_id, region, solo_rank, flex_rank, solo_wins, solo_losses, solo_remakes, flex_wins, flex_losses, flex_remakes, kills, deaths, assists) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *', [summoner_id, region, solo_rank, flex_rank, solo_wins, solo_losses, solo_remakes, flex_wins, flex_losses, flex_remakes, kills, deaths, assists]
        )
    return result.rows[0];
    }

    static async updateStats(stat_id, {summoner_id, region, solo_rank, flex_rank, solo_wins, solo_losses, solo_remakes, flex_wins, flex_losses, flex_remakes, kills, deaths, assists}){
        const result = await pool.query(
            'UPDATE stats SET summoner_id = $1, region = $2, solo_rank = $3, flex_rank = $4, solo_wins = $5, solo_losses = $6, solo_remakes = $7, flex_wins = $8, flex_losses = $9, flex_remakes = $10, kills = $11, deaths = $12, assists = $13 WHERE stat_id = $14 RETURNING *', [summoner_id, region, solo_rank, flex_rank, solo_wins, solo_losses, solo_remakes, flex_wins, flex_losses, flex_remakes, kills, deaths, assists, stat_id]
        )
    }

    static async deleteStats(stat_id){
        await pool.query('DELETE FROM stats WHERE stat_id = $1', [stat_id]);
    }

    static async calculateKDAByStats(summoner_id) {
        const result = await pool.query(
            `SELECT 
                SUM(s.kills) AS total_kills,
                SUM(s.deaths) AS total_deaths,
                SUM(s.assists) AS total_assists,
                CASE 
                    WHEN SUM(s.deaths) = 0 THEN NULL 
                    ELSE ROUND((SUM(s.kills) + SUM(s.assists))::DECIMAL / SUM(s.deaths), 2) 
                END AS kda
             FROM stats s
             WHERE s.summoner_id = $1`,
            [summoner_id]
        );
        return result.rows[0]; // Retourne le KDA global
    }

    static async calculateWinRate(summoner_id) {
        const result = await pool.query(
            `SELECT 
                (SUM(s.solo_wins) + SUM(s.flex_wins)) AS total_wins,
                (SUM(s.solo_losses) + SUM(s.flex_losses)) AS total_losses,
                ROUND(100.0 * (SUM(s.solo_wins) + SUM(s.flex_wins)) / 
                      NULLIF(SUM(s.solo_wins) + SUM(s.flex_wins) + SUM(s.solo_losses) + SUM(s.flex_losses), 0), 2) AS win_rate
             FROM stats s
             WHERE s.summoner_id = $1`,
            [summoner_id]
        );
        return result.rows[0]; // Retourne le Win Rate global
    }
}

module.exports = Statistics;
