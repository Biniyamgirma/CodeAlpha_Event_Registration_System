const pool = require('../../database/connection');

const getAllEvents = (req, res) => {
    try{
        pool.query('SELECT * FROM events', (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(200).json(results.rows);
    });
    }catch(error){
        console.log(error);
        res.status(500).json({ error: error.message });
    }
    
};

const getEventById = (req, res) => {
    const eventId = req.params.id;
    try{
        pool.query('SELECT * FROM events WHERE event_id = $1',
            [eventId],
            (error, results) => {
                if(error){
                    return res.status(500).json({ error: error.message });
                }
                if(results.rows.length === 0){
                    return res.status(404).json({ error: 'Event not found' });
                }
                res.status(200).json(results.rows[0]);
            }
        );
    }catch(error){
        res.status(500).json({ error: error.message });
    }
}
const searchEventsByLocation = (req, res) => {
    const location = req.params.location;

    try{
     pool.query(
        'SELECT * FROM events WHERE city = $1 OR state = $1 OR country = $1',
        [location],
        (error, results) => {
            if(error){
                return res.status(500).json({ error: error.message });
            }
            if(results.rows.length === 0){
                return res.status(404).json({ error: 'No events found for the given location' });
            }
            res.status(200).json(results.rows);
        }
    );
    }catch(error){
        res.status(500).json({ error: error.message });
    }
    }
module.exports = {
    getAllEvents,
    getEventById,
    searchEventsByLocation
};