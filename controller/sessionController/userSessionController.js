const pool = require('../../database/connection')

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
const sessionRegistration = (req,res)=>{
    const {
        session_id,
    registration_id
    } = req.body;
    const query1 = 'SELECT * FROM event_sessions WHERE session_id = ?';
    pool.query(query1,[session_id],(error,results)=>{
        if(error){
            console.error('Error fetching session');
            return res.status(500).json({error:'Database error'});
        }
        if(results.length === 0){
            return res.status(404).json({error:'Session not found'});
        }
        if(results[0].max_attendees === 0){
            return res.status(400).json({error:'Session is full'});
        }
        const updatedAttendees = results[0].max_attendees - 1;

        const query2 = 'UPDATE event_sessions SET max_attendees = ? WHERE session_id = ?';
        pool.query(query2,[updatedAttendees,session_id],(error,results)=>{
            if(error){
                console.error('Error updating session attendees');
                return res.status(500).json({error:'Database error'});
            }
            const query3 = 'INSERT INTO session_registration (session_id,registration_id) VALUES (?,?)';
            pool.query(query3,[session_id,registration_id],(error,results)=>{
                if(error){
                    console.error('Error registering session');
                    return res.status(500).json({error:'Database error'});
                }
                res.status(201).json({message:'Session registered successfully'});
            });
        });
    });

    
    

}
module.exports = {
    getSessionsByEventId,
    sessionRegistration
}