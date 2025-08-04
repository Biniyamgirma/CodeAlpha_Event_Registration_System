const pool = require('../../database/connection');

const createSession = (req,res)=>{
    const {
        event_id,
    title,
    description,
    start_datetime,
    end_datetime,
    location,
    max_attendees,
    session_type
    } = req.body;
    const query = 'INSERT INTO event_sessions (event_id,title,description,start_datetime,end_datetime,location,max_attendees,session_type) VALUSE (?,?,?,?,?,?,?,?)';
    const values = [event_id,
        title,
        description,
        start_datetime,
        end_datetime,
        location,
        max_attendees,
        session_type];
    pool.query(query,values,(error,results)=>{
        if(error){
            console.error('Error creating session:',error);
            return res.status(500).json({error:'Database error'});
        }   
        res.status(201).json({message:'Session created successfully'});
    });
}
const updateSession = (req,res)=>{
    const sessionId = req.params.sessionId;
    const {
        event_id,
    title,
    description,
    start_datetime,
    end_datetime,
    location,
    max_attendees,
    session_type
    } = req.body;
    const query = 'UPDATE event_sessions SET event_id = ?,title = ?,description = ?,start_datetime = ?,end_datetime = ?,location = ?,max_attendees = ?,session_type = ? WHERE session_id = ?';  
    const values = [event_id,
        title,
        description,
        start_datetime,
        end_datetime,
        location,
        max_attendees,
        session_type,
        sessionId];
    pool.query(query,values,(error,results)=>{
        if(error){
            console.error('Error updating session:',error)
            return res.status(500).json({error:'Database error'});
        }
        if(results.affectedRows === 0){
            return res.status(404).json({error:'Session not found'});
        }
        res.json({message:'Session updated successfully'});
    });
}
const getSessionsByEventId = (req,res)=>{
    const eventId = req.params.eventId;
    const query = 'SELECT * FROM event_sessions WHERE event_id = ?';
    pool.query(query,[eventId],(error,results)=>{
        if(error){
            console.error('Error fetching sessions',error);
            return res.status(500).json({error:'Database error'});
        }
        res.json(results);
    });
}
const disableSession = (req,res)=>{
    const {session_id}=req.body;
    const query = 'UPDATE event_sessions SET is_active = false WHERE session_id = ?';
    pool.query(query,[session_id],(error,results)=>{
        if(error){
            console.error('Error disabling session');
            return res.status(500).json({error:'Database error'});
        }
        res.json({message:'Session disabled successfully'});
    });
}
const enableSession = (req,res)=>{
    const {session_id}=req.body;
    const query = 'UPDATE event_sessions SET is_active = true WHERE session_id = ?';
    pool.query(query,[session_id],(error,results)=>{
        if(error){
            console.error('Error enabling session');
            return res.status(500).json({error:'Database error'});
        }
        res.json({message:'Session enabled successfully'});
    });
}
module.exports = {
    createSession,
    updateSession,
    getSessionsByEventId,
    disableSession,
    enableSession
}
