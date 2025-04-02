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


    // 📌 Obtenir un aperçu global des statistiques d'un joueur
    // static async getStatsOverview(region, summonerName) {
    //     const result = await pool.query(
    //         `SELECT s.*, su.summoner_name 
    //          FROM stats s
    //          JOIN summoners su ON s.summoner_id = su.summoner_id
    //          WHERE s.region = $1 AND su.summoner_name = $2`,
    //         [region, summonerName]
    //     );
    //     return result.rows[0]; // Retourne les statistiques globales
    // }

    // // 📌 Obtenir le KDA global d'un joueur
    // static async getKDA(region, summonerName) {
    //     const result = await pool.query(
    //         `SELECT su.summoner_name,
    //                 SUM(s.kills) AS total_kills,
    //                 SUM(s.deaths) AS total_deaths,
    //                 SUM(s.assists) AS total_assists,
    //                 CASE 
    //                     WHEN SUM(s.deaths) = 0 THEN NULL 
    //                     ELSE ROUND((SUM(s.kills) + SUM(s.assists))::DECIMAL / SUM(s.deaths), 2) 
    //                 END AS kda
    //          FROM stats s
    //          JOIN summoners su ON s.summoner_id = su.summoner_id
    //          WHERE s.region = $1 AND su.summoner_name = $2
    //          GROUP BY su.summoner_name`,
    //         [region, summonerName]
    //     );
    //     return result.rows[0];
    // }

    // // 📌 Obtenir le taux de victoire global
    // static async getWinrate(region, summonerName) {
    //     const result = await pool.query(
    //         `SELECT su.summoner_name,
    //                 (SUM(s.solo_wins) + SUM(s.flex_wins)) AS total_wins,
    //                 (SUM(s.solo_losses) + SUM(s.flex_losses)) AS total_losses,
    //                 ROUND(100.0 * (SUM(s.solo_wins) + SUM(s.flex_wins)) / 
    //                       NULLIF(SUM(s.solo_wins) + SUM(s.flex_wins) + SUM(s.solo_losses) + SUM(s.flex_losses), 0), 2) AS winrate
    //          FROM stats s
    //          JOIN summoners su ON s.summoner_id = su.summoner_id
    //          WHERE s.region = $1 AND su.summoner_name = $2
    //          GROUP BY su.summoner_name`,
    //         [region, summonerName]
    //     );
    //     return result.rows[0];
    // }

    // //  Obtenir les statistiques par champion
    // static async getStatsByChampion(region, summonerName) {
    //     const result = await pool.query(
    //         `SELECT c.champion_name, 
    //                 COUNT(*) AS games_played,
    //                 SUM(s.kills) AS total_kills,
    //                 SUM(s.deaths) AS total_deaths,
    //                 SUM(s.assists) AS total_assists,
    //                 CASE 
    //                     WHEN SUM(s.deaths) = 0 THEN NULL 
    //                     ELSE ROUND((SUM(s.kills) + SUM(s.assists))::DECIMAL / SUM(s.deaths), 2) 
    //                 END AS kda
    //          FROM stats s
    //          JOIN summoners su ON s.summoner_id = su.summoner_id
    //          JOIN matches m ON su.summoner_id = m.summoner_id
    //          JOIN champion c ON m.champion_id = c.champion_id
    //          WHERE s.region = $1 AND su.summoner_name = $2
    //          GROUP BY c.champion_name`,
    //         [region, summonerName]
    //     );
    //     return result.rows;
    // }

    // //  Obtenir les statistiques par rôle
    // static async getStatsByRole(region, summonerName) {
    //     const result = await pool.query(
    //         `SELECT c.role, COUNT(*) AS games_played
    //          FROM stats s
    //          JOIN summoners su ON s.summoner_id = su.summoner_id
    //          JOIN matches m ON su.summoner_id = m.summoner_id
    //          JOIN champion c ON m.champion_id = c.champion_id
    //          WHERE s.region = $1 AND su.summoner_name = $2
    //          GROUP BY c.role`,
    //         [region, summonerName]
    //     );
    //     return result.rows;
    // }

    // //  Obtenir les objets les plus utilisés
    // static async getMostUsedItems(region, summonerName) {
    //     const result = await pool.query(
    //         `SELECT i.item_name, COUNT(*) AS times_used
    //          FROM matches m
    //          JOIN summoners su ON m.summoner_id = su.summoner_id
    //          JOIN items i ON m.item_id = i.item_id
    //          WHERE su.region = $1 AND su.summoner_name = $2
    //          GROUP BY i.item_name
    //          ORDER BY times_used DESC
    //          LIMIT 10`,
    //         [region, summonerName]
    //     );
    //     return result.rows;
    // }

    // //  Obtenir les runes les plus utilisées
    // static async getMostUsedRunes(region, summonerName) {
    //     const result = await pool.query(
    //         `SELECT r.rune_name, COUNT(*) AS times_used
    //          FROM matches m
    //          JOIN summoners su ON m.summoner_id = su.summoner_id
    //          JOIN runes r ON m.rune_id = r.rune_id
    //          WHERE su.region = $1 AND su.summoner_name = $2
    //          GROUP BY r.rune_name
    //          ORDER BY times_used DESC
    //          LIMIT 10`,
    //         [region, summonerName]
    //     );
    //     return result.rows;
    // }

    // //  Obtenir les sorts d'invocateur les plus utilisés
    // static async getMostUsedSpells(region, summonerName) {
    //     const result = await pool.query(
    //         `SELECT sp.spell_name, COUNT(*) AS times_used
    //          FROM matches m
    //          JOIN summoners su ON m.summoner_id = su.summoner_id
    //          JOIN spells sp ON m.spell_id = sp.spell_id
    //          WHERE su.region = $1 AND su.summoner_name = $2
    //          GROUP BY sp.spell_name
    //          ORDER BY times_used DESC
    //          LIMIT 10`,
    //         [region, summonerName]
    //     );
    //     return result.rows;
    // }

    // //  Obtenir les dégâts moyens infligés/subis
    // static async getAverageDamage(region, summonerName) {
    //     const result = await pool.query(
    //         `SELECT AVG(m.damage_dealt) AS avg_damage_dealt, AVG(m.damage_taken) AS avg_damage_taken
    //          FROM matches m
    //          JOIN summoners su ON m.summoner_id = su.summoner_id
    //          WHERE su.region = $1 AND su.summoner_name = $2`,
    //         [region, summonerName]
    //     );
    //     return result.rows[0];
    // }

    // //  Obtenir l'or moyen gagné
    // static async getAverageGold(region, summonerName) {
    //     const result = await pool.query(
    //         `SELECT AVG(m.gold_earned) AS avg_gold
    //          FROM matches m
    //          JOIN summoners su ON m.summoner_id = su.summoner_id
    //          WHERE su.region = $1 AND su.summoner_name = $2`,
    //         [region, summonerName]
    //     );
    //     return result.rows[0];
    // }
}

module.exports = Statistics;
