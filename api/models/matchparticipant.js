const { Pool} = require('pg');
require('dotenv').config();

const pool = new Pool ({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
})

class MatchParticipant {
    

    // Obtenir tous les match auxquels un summoner a participé
    static async getMatchParticipantsBySummonerId(summoner_id) {
        const result = await pool.query(
            `SELECT mp.participant_id, mp.match_id, mp.champion_id, mp.team_id, mp.kills, mp.deaths, mp.assists, mp.kda, mp.cs, mp.gold_earned, mp.role, mp.profit, mp.summoner_spells, m.game_duration, m.game_type, m.start_time, m.winning_team_side, t.team_side 
            FROM match_participants mp 
            INNER JOIN matches m ON mp.match_id = m.match_id 
            INNER JOIN teams t ON mp.team_id = t.team_id 
            WHERE mp.summoner_id = $1 
            ORDER BY m.start_time DESC`, 
            [summoner_id]
        );
        return result.rows;
    }

    static async getAllMatchParticipants(){
        const result = await pool.query('SELECT * FROM match_participants');
        return result.rows;
    }

    static async getMatchByMatchParticipantId(participant_id) {
        const result = await pool.query(
            `SELECT m.*
             FROM matches m
             INNER JOIN match_participants mp ON m.match_id = mp.match_id
             WHERE mp.participant_id = $1`,
            [participant_id]
        );
        return result.rows[0]; // Retourne les informations du match
    }

    static async getMatchParticipantsByMatchId(match_id) {
        const result = await pool.query(
            `SELECT mp.participant_id, mp.match_id, mp.summoner_id, mp.team_id, mp.kills, mp.deaths, mp.assists, mp.kda, mp.cs, mp.gold_earned, mp.role, mp.profit, mp.summoner_spells, 
                    s.summoner_name, t.team_side, c.champion_name, c.champion_image
             FROM match_participants mp
             INNER JOIN summoners s ON mp.summoner_id = s.summoner_id
             INNER JOIN teams t ON mp.team_id = t.team_id
             INNER JOIN champion c ON mp.champion_id = c.champion_id
             WHERE mp.match_id = $1`,
            [match_id]
        );
        return result.rows; // Retourne les participants avec les informations des champions
    }

    static async createMatchParticipant({ match_id, champion_id, summoner_id, team_id, kills, deaths, assists, kda, cs, gold_earned, role, profit, summoner_spells }) {
        const result = await pool.query(
            'INSERT INTO match_participants (match_id, champion_id, summoner_id, team_id, kills, deaths, assists, kda, cs, gold_earned, role, profit, summoner_spells) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *',
            [match_id, champion_id, summoner_id, team_id, kills, deaths, assists, kda, cs, gold_earned, role, profit, summoner_spells]
        );
        
        return result.rows[0];
    }
    
    static async getMatchParticipantById(participant_id) {
        const result = await pool.query('SELECT * FROM match_participants WHERE participant_id = $1', [participant_id]);
        return result.rows[0];
    }
    
    static async updateMatchParticipant(participant_id, { match_id, champion_id, summoner_id, team_id, kills, deaths, assists, kda, cs, gold_earned, role, profit, summoner_spells }) {
        const result = await pool.query(
            'UPDATE match_participants SET match_id = $1, champion_id = $2, summoner_id = $3, team_id = $4, kills = $5, deaths = $6, assists = $7, kda = $8, cs = $9, gold_earned = $10, role = $11, profit = $12, summoner_spells = $13 WHERE participant_id = $14 RETURNING *',
            [match_id, champion_id, summoner_id, team_id, kills, deaths, assists, kda, cs, gold_earned, role, profit, summoner_spells, participant_id]
        );
        return result.rows[0];
    }

    
    static async deleteMatchParticipant(participant_id) {
        await pool.query('DELETE FROM match_participants WHERE participant_id = $1', [participant_id]);
    }
}

module.exports = MatchParticipant;