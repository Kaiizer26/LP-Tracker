const { Pool} = require('pg');
require('dotenv').config();

const pool = new Pool ({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
})

class Team {
    static async getAllTeams(){
        const result = await pool.query('SELECT * FROM teams');
        return result.rows;
    }

    static async getTeamById(team_id){
        const result = await pool.query('SELECT * FROM teams WHERE team_id = $1', [team_id])
        return result.rows[0]
    }

    static async createTeam({match_id, team_name, team_side}){
        const result = await pool.query(
            'INSERT INTO teams (match_id, team_name, team_side) VALUES ($1, $2, $3) RETURNING *', [match_id, team_name, team_side]
        )
    return result.rows[0]
    }

    static async updateTeam(team_id, {match_id, team_name, team_side}){
        const result = await pool.query(
            'UPDATE teams SET match_id = $1, team_name = $2, team_side = $3 WHERE team_id = $4 RETURNING *', [match_id, team_name, team_side, team_id]
        )
    }

    static async deleteTeam(team_id){
        await pool.query('DELETE FROM teams WHERE team_id = $1', [team_id]);
    }
}

module.exports = Team;