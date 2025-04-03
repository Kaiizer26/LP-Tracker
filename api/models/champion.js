const { Pool} = require('pg');
require('dotenv').config();

const pool = new Pool ({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
})
class Champion {
    
    // Obtenir la liste complète des champions disponibles dans le jeu
    static async getAllChampions() {
        const result = await pool.query(
            `SELECT * FROM Champion`
        );
        return result.rows;
    }

    static async getChampionById(champion_id) {
        const result = await pool.query(
            `SELECT *
             FROM Champion
             WHERE champion_id = $1`,
            [champion_id]
        );
        return result.rows[0];
    }

    static async getChampionByChampionName(champion_name) {
        const result = await pool.query(
            `SELECT *
             FROM Champion
             WHERE champion_name = $1`,
            [champion_name]
        );
        return result.rows[0];
    }
    // Obtenir la liste des champions joués par un invocateur
    static async getChampionsBySummoner(region, summonerName) {
        const result = await pool.query(
            `SELECT DISTINCT c.*
             FROM Champion c
             JOIN Matches m ON c.champion_id = m.champion_id
             JOIN Summoners s ON m.summoner_id = s.summoner_id
             WHERE s.region = $1 AND s.summoner_name = $2`,
            [region, summonerName]
        );
        return result.rows;
    }
    
    

    // Obtenir les statistiques d’un champion pour un invocateur
    static async getChampionStats(region, summonerName, championId) {
        const result = await pool.query(
            `SELECT c.*, 
                    COUNT(m.match_id) AS games_played,
                    AVG(m.kills) AS avg_kills,
                    AVG(m.deaths) AS avg_deaths,
                    AVG(m.assists) AS avg_assists
             FROM Champion c
             JOIN Matches m ON c.champion_id = m.champion_id
             JOIN Summoners s ON m.summoner_id = s.summoner_id
             WHERE s.region = $1 AND s.summoner_name = $2 AND c.champion_id = $3
             GROUP BY c.champion_id`,
            [region, summonerName, championId]
        );
        return result.rows[0];
    }

    // Obtenir le KDA moyen par champion
    static async getChampionKDA(region, summonerName) {
        const result = await pool.query(
            `SELECT c.champion_name, 
                    AVG(m.kills + m.assists) / NULLIF(AVG(m.deaths), 0) AS kda
             FROM Champion c
             JOIN Matches m ON c.champion_id = m.champion_id
             JOIN Summoners s ON m.summoner_id = s.summoner_id
             WHERE s.region = $1 AND s.summoner_name = $2
             GROUP BY c.champion_name`,
            [region, summonerName]
        );
        return result.rows;
    }

    // Obtenir le taux de victoire par champion
    static async getChampionWinrate(region, summonerName) {
        const result = await pool.query(
            `SELECT c.champion_name, 
                    COUNT(*) AS games_played,
                    SUM(CASE WHEN m.win = TRUE THEN 1 ELSE 0 END) * 100.0 / COUNT(*) AS winrate
             FROM Champion c
             JOIN Matches m ON c.champion_id = m.champion_id
             JOIN Summoners s ON m.summoner_id = s.summoner_id
             WHERE s.region = $1 AND s.summoner_name = $2
             GROUP BY c.champion_name`,
            [region, summonerName]
        );
        return result.rows;
    }

    // Obtenir le CS moyen par champion
    static async getChampionCS(region, summonerName) {
        const result = await pool.query(
            `SELECT c.champion_name, AVG(m.cs) AS avg_cs
             FROM Champion c
             JOIN Matches m ON c.champion_id = m.champion_id
             JOIN Summoners s ON m.summoner_id = s.summoner_id
             WHERE s.region = $1 AND s.summoner_name = $2
             GROUP BY c.champion_name`,
            [region, summonerName]
        );
        return result.rows;
    }

    // Obtenir les dégâts moyens par champion
    static async getChampionDamage(region, summonerName) {
        const result = await pool.query(
            `SELECT c.champion_name, AVG(m.damage_dealt) AS avg_damage
             FROM Champion c
             JOIN Matches m ON c.champion_id = m.champion_id
             JOIN Summoners s ON m.summoner_id = s.summoner_id
             WHERE s.region = $1 AND s.summoner_name = $2
             GROUP BY c.champion_name`,
            [region, summonerName]
        );
        return result.rows;
    }

    // Obtenir l'or moyen par champion
    static async getChampionGold(region, summonerName) {
        const result = await pool.query(
            `SELECT c.champion_name, AVG(m.gold_earned) AS avg_gold
             FROM Champion c
             JOIN Matches m ON c.champion_id = m.champion_id
             JOIN Summoners s ON m.summoner_id = s.summoner_id
             WHERE s.region = $1 AND s.summoner_name = $2
             GROUP BY c.champion_name`,
            [region, summonerName]
        );
        return result.rows;
    }



    // Création d'un champion
    static async createChampion({ champion_name, lore, champion_image }) {
        const result = await pool.query(
            `INSERT INTO Champion (champion_name, champion_image, lore) 
             VALUES ($1, $2, $3) RETURNING *`,
            [champion_name, champion_image, lore]
        );
        return result.rows[0];
    }

    // Mise à jour d'un champion
    static async updateChampion(champion_id, { champion_name, champion_image, lore }) {
        const result = await pool.query(
            `UPDATE Champion 
             SET champion_name = $1, champion_image = $2, lore = $3 updated_at = CURRENT_TIMESTAMP
             WHERE champion_id = $4
             RETURNING *`,
            [champion_name, champion_image, lore, champion_id]
        );
        return result.rows[0];
    }

    // Suppression d'un champion
    static async deleteChampion(champion_id) {
        const result = await pool.query(
            `DELETE FROM Champion WHERE champion_id = $1 RETURNING *`,
            [champion_id]
        );
        return result.rows[0];
    }
}

module.exports = Champion;
