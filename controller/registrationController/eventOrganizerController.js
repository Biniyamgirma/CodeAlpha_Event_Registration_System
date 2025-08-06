const pool = require('../../database/connection');

const getByEventId = async(req,res)=>{
    const {eventId}=req.params;
    console.log(eventId)
    try{
        const query = `SELECT * FROM registrations WHERE event_id = $1`
        const value = [eventId]
        const data = await pool.query(query,value);

        res.status(200).json({
            data:data.rows
        })

    }catch(error){
        res.status(400).json({message:error.message})
    }
}
const getActiveRegistration = async(req,res) =>{
    const{eventId}=req.params;
    try{
        const query = `SELECT * FROM registrations WHERE event_id = $1 AND status = 'confirmed'`
        const value = [eventId];
        const data = await pool.query(query,value);
        res.status(200).json({
            data:data.rows
        })
    }catch(error){
        res.status(400).json({message:error.message})
    }
}
const getActiveRegistrationByTicketId = async(req,res)=>{
    const{ticketId}=req.params;
    try{
        const query = `SELECT * FROM registrations WHERE ticket_id = $1 AND status = 'confirmed'`
        const value = [ticketId];
        const data = await pool.query(query,value);
        res.status(200).json({
            data:data.rows
        })
    }catch(error){
        res.status({message:error.message});
    }
}
const canceledRegistrationByEventId= async(req,res)=>{
    const{eventId}=req.params;
    try{
        const query = `SELECT * FROM registrations WHERE event_id = $1 AND status = 'cancelled'`
        const value = [eventId]
        const data = await pool.query(query,value);
        res.status(200).json({
            data:data.rows
        })
    }catch(error){
        res.status(400).json({
            message:error.message
        })
    }
}
module.exports={getByEventId,getActiveRegistration,
    getActiveRegistrationByTicketId,canceledRegistrationByEventId

};