const pool = require('../../database/connection')

const registrations = (req, res)=>{
    const {
        event_id,
    user_id,
    ticket_id,
    registration_date,
    status,
    discount_code_id,
    notes,
    accessibility_requirements
    } = req.body;
    pool.query('INSERT INTO registrations (event_id,user_id,ticket_id,registration_date,status,discount_code_id,notes,accessibility_requirements) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
        [
            event_id,
            user_id,
            ticket_id,
            registration_date,
            status,
            discount_code_id,
            notes,
            accessibility_requirements
        ],(error,results)=>{
            if(error){
                res.status(400).json({error:error.message})
            }
            res.status(200).json({message:"you havebeen registred sucssfully"})
        }
    );
}