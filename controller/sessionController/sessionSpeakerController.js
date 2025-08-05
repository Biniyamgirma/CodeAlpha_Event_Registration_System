const pool = require('../../database/connection');

const addSessionSpeaker = (req,res)=>{
    const {
       user_id,
    first_name,
    last_name,
    email,
    phone,
    organization,
    job_title,
    bio,
    website_url,
    twitter_handle,
    linkedin_url,
    telegram_url
    } = req.body;
    const filename = req.file.filename || req.body.filename || null;
    const query = 'INSERT INTO session_speakers (user_id,first_name,last_name,email,phone,organization,job_title,bio,profile_image_url,website_url,twitter_handle,linkedin_url,telegram_url) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)';
    const values = [user_id,
        first_name,
        last_name,
        email,
        phone,
        organization,
        job_title,
        bio,
        filename,
        website_url,
        twitter_handle,
        linkedin_url,
        telegram_url];
    pool.query(query,values,(error,results)=>{
        if(error){
            console.error('Error adding session speaker:',error);
            return res.status(500).json({error:'Database error'});
        }
        res.status(201).json({message:'Session speaker added successfully'});
    }); 
}
const updateSessionSpeaker = (req,res)=>{
    const speakerId = req.params.speakerId;
    const {
       user_id,
    first_name,
    last_name,
    email,
    phone,
    organization,
    job_title,
    bio,
    website_url,
    twitter_handle,
    linkedin_url,
    telegram_url
    } = req.body;
    const filename = req.file.filename || req.body.filename || null;
    const query = 'UPDATE session_speakers SET user_id = ?,first_name = ?,last_name = ?,email = ?,phone = ?,organization = ?,job_title = ?,bio = ?,profile_image_url = ?,website_url = ?,twitter_handle = ?,linkedin_url = ?,telegram_url = ? WHERE speaker_id = ?';
    const values = [user_id,
        first_name,
        last_name,
        email,
        phone,
        organization,
        job_title,
        bio,
        filename,
        website_url,
        twitter_handle,
        linkedin_url,
        telegram_url,
        speakerId];
        pool.query(query,values,(error,results)=>{
            if(error){
                console.error('Error updating session speaker');
                return res.status(500).json({error:'Database error'});
            }
            if(results.affectedRows === 0){
                return res.status(404).json({error:'Session speaker not found'});
            }
            res.json({message:'Session speaker updated successfully'});
        });
}
const disableSessionSpeaker = (req,res)=>{
    const speakerId = req.params.speakerId;
    const query = 'UPDATE session_speakers SET is_active = false WHERE speaker_id = ?';
    pool.query(query,[speakerId],(error,results)=>{
        if(error){
            console.error('Error disabling session  speaker');
            return res.status(500).json({error:'Database error'});
        }
        res.json({message:'Session speaker disabled successfully'});
    });
}
const enableSessionSpeaker = (req,res)=>{
    const speakerId = req.params.speakerId;
    const query = 'UPDATE session_speakers SET is_active = true WHERE speaker_id = ?';
    pool.query(query,[speakerId],(error,results)=>{
        if(error){
            console.error('Error enabling session speaker');
            return res.status(500).json({error:'Database error'});
        }
        res.json({message:'Session speaker enabled successfully'});
    });
}
const getSessionSpeakersBySessionId = (req,res)=>{
    const sessionId = req.params.sessionId;
    const query = 'SELECT * FROM session_speakers WHERE session_id = ?';
    pool.query(query,[sessionId],(error,results)=>{
        if(error){
            console.error('Error fetching session speakers');
            return res.status(500).json({error:'Database error'});
        }
        res.json(results);
    });
}
const sessionSpeakerMapping = (req,res)=>{
    const{
        sessionId,
        speaker_id,
        is_primary,
        speaking_order
    } = req.body;
    const query = 'INSERT INTO session_speaker_mapping(sessionId,speaker_id,is_primary,speaking_order) VALUES (?,?,?,?)'
    const value=[
        sessionId,
        speaker_id,
        is_primary,
        speaking_order
    ];
    pool.query(query,value,(error,results)=>{
        if(error){
            return res.status(500).json({message:'Database error'})
        }
        res.status(200).json({message:'Speaker added to session successfully'});
    })
}
module.exports = {
    addSessionSpeaker,
    updateSessionSpeaker,
    disableSessionSpeaker,
    enableSessionSpeaker,
    getSessionSpeakersBySessionId,
    sessionSpeakerMapping
}
