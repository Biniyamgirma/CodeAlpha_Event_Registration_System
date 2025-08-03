const pool = require('../../database/connection');

const test = async(req,res)=>{
    
  try {
    await pool.connect();
    console.log('Connected to PostgreSQL database');
  } catch (error) {
    console.error('Connection error', error.stack);
  }

}

module.exports={
    test
}