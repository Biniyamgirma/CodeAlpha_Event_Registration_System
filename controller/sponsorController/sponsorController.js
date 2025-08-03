
const pool = require('../../database/connection');
const getAllSponsors = (req,res)=>{
    pool.query('SELECT * FROM event_sponsors', (error, results) => {
        if (error) {
            return res.status(500).json({
                message: 'Error fetching sponsors',
                error: error.message
            });
        }
        res.status(200).json({
            message: 'Sponsors fetched successfully',
            data: results.rows
        });
    });
}
const createSponsor = (req,res)=>{
    const {name,description,logo_url,sponsor_level,website_url,contact_email,contact_phone, event_id} = req.body;
    if(!name || !description || !logo_url || !sponsor_level || !website_url || !contact_email || !contact_phone || !event_id){
        return res.status(400).json({
            message: 'All fields are required'
        });
    }
    pool.query('INSERT INTO event_sponsors (name, description, logo_url, sponsor_level, website_url, contact_email, contact_phone, event_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', 
    [name, description, logo_url, sponsor_level, website_url, contact_email, contact_phone, event_id], (error, results) => {
        if (error) {
            return res.status(500).json({
                message: 'Error creating sponsor',
                error: error.message
            });
        }
    });
    res.status(200).json({
        message: 'Sponsor created successfully'
    });
}
const updateSponsor = (req,res)=>{
    const {sponsor_id, name, description, logo_url, sponsor_level, website_url, contact_email, contact_phone} = req.body;   
    if(!sponsor_id || !name || !description || !logo_url || !sponsor_level || !website_url || !contact_email || !contact_phone){
        return res.status(400).json({
            message: 'All fields are required'
        });
    }
    pool.query('UPDATE event_sponsors SET name = $1, description = $2, logo_url = $3, sponsor_level = $4, website_url = $5, contact_email = $6, contact_phone = $7 WHERE sponsor_id = $8',
    [name, description, logo_url, sponsor_level, website_url, contact_email, contact_phone, sponsor_id], (error, results) => {
        if (error) {
            return res.status(500).json({
                message: 'Error updating sponsor',
                error: error.message
            });
        }
    });
    res.status(200).json({
        message: 'Sponsor updated successfully'
    });
}
const getSponsorById = (req,res)=>{
    const {sponsor_id} = req.params;
    if(!sponsor_id){
        return res.status(400).json({
            message: 'Sponsor ID is required'
        });
    }
    pool.query('SELECT * FROM event_sponsors WHERE sponsor_id = $1', [sponsor_id], (error, results) => {
        if (error) {
            return res.status(500).json({
                message: 'Error fetching sponsor',
                error: error.message
            });
        }
        if(results.rows.length === 0){
            return res.status(404).json({
                message: 'Sponsor not found'
            });
        }
        res.status(200).json({
            message: 'Sponsor fetched successfully',
            data: results.rows[0]
        });
    });
}
const getSponsorByEventId = (req,res)=>{
    const {eventId} = req.params;
    if(!eventId){
        return res.status(400).json({
            message: 'Event ID is required'
        });
    }   
    pool.query('SELECT * FROM event_sponsors WHERE event_id = $1', [eventId], (error, results) => {
        if (error) {
            return res.status(500).json({
                message: 'Error fetching sponsors',
                error: error.message
            });
        }
        res.status(200).json({
            message: 'Sponsors fetched successfully',
            data: results.rows
        });
    });
}
const blockSponsor = (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({
            message: 'Sponsor ID is required'
        });
    }
    pool.query('UPDATE event_sponsors SET is_active = false WHERE sponsor_id = $1', [id], (error, results) => {
        if (error) {
            return res.status(500).json({
                message: 'Error blocking sponsor',
                error: error.message
            });
        }
        res.status(200).json({
            message: 'Sponsor blocked successfully'
        });
    });
}
module.exports = {
    getAllSponsors,
    createSponsor,
    updateSponsor,
    getSponsorById,
    getSponsorByEventId,
    blockSponsor
};