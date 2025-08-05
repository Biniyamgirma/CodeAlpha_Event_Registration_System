const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER ||'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DATABASE || 'event_registration',
    password: process.env.DB_PASSWORD || '1234',
    port: process.env.DB_PORT || 5432
});

async function connection(){
    try {
        await pool.connect();
        console.log('Connected to the database');
        return pool;
    }catch (error){
        console.error('Database connection error:', error.stack);
    }
}
module.exports= pool;