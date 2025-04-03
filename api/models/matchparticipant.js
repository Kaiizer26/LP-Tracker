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
            `SELECT mp.participant_id, mp.match_id, mp.champion_id, mp.summoner_id, mp.team_id, mp.item_participant_id, mp.rune_participant_id, mp.summoner_spell_participant_id, mp.kills, mp.deaths, mp.assists, mp.kda, mp.cs, mp.gold_earned, mp.role, mp.profit, mp.damage, m.game_duration, m.game_type, m.start_time, m.winning_team_side, t.team_side 
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
            `SELECT mp.participant_id, mp.match_id, mp.summoner_id, mp.team_id, mp.item_participant_id, mp.rune_participant_id, mp.summoner_spell_participant_id, mp.kills, mp.deaths, mp.assists, mp.kda, mp.cs, mp.gold_earned, mp.role, mp.profit, mp.damage, 
            s.summoner_name, t.team_side, c.champion_name
             FROM match_participants mp
             INNER JOIN summoners s ON mp.summoner_id = s.summoner_id
             INNER JOIN teams t ON mp.team_id = t.team_id
             INNER JOIN champions c ON mp.champion_id = c.champion_id
             WHERE mp.match_id = $1`,
            [match_id]
        );
        return result.rows; // Retourne les participants avec les informations des champions
    }

    static async createMatchParticipant({ match_id, champion_id, summoner_id, team_id, item_participant_id, rune_participant_id, summoner_spell_participant_id, kills, deaths, assists, kda, cs, gold_earned, role, profit, damage }) {
        const result = await pool.query(
            'INSERT INTO match_participants (match_id, champion_id, summoner_id, team_id, item_participant_id, rune_participant_id, summoner_spell_participant_id, kills, deaths, assists, kda, cs, gold_earned, role, profit, damage) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *',
            [match_id, champion_id, summoner_id, team_id, item_participant_id, rune_participant_id, summoner_spell_participant_id, kills, deaths, assists, kda, cs, gold_earned, role, profit, damage]
        );
        
        return result.rows[0];
    }
    
    static async getMatchParticipantById(participant_id) {
        const result = await pool.query('SELECT * FROM match_participants WHERE participant_id = $1', [participant_id]);
        return result.rows[0];
    }
    
    static async updateMatchParticipant(participant_id, { match_id, champion_id, summoner_id, team_id, item_participant_id, rune_participant_id, summoner_spell_participant_id, kills, deaths, assists, kda, cs, gold_earned, role, profit, damage }) {
        const result = await pool.query(
            'UPDATE match_participants SET match_id = $1, champion_id = $2, summoner_id = $3, team_id = $4, item_participant_id = $5, rune_participant_id = $6, summoner_spell_participant_id = $7, kills = $8, deaths = $9, assists = $10, kda = $11, cs = $12, gold_earned = $13, role = $14, profit = $15, summoner_spells = $16 WHERE participant_id = $17 RETURNING *',
            [match_id, champion_id, summoner_id, team_id, item_participant_id, rune_participant_id, summoner_spell_participant_id, kills, deaths, assists, kda, cs, gold_earned, role, profit, damage, participant_id]
        );
        return result.rows[0];
    }

    
    static async deleteMatchParticipant(participant_id) {
        await pool.query('DELETE FROM match_participants WHERE participant_id = $1', [participant_id]);
    }
}

module.exports = MatchParticipant;