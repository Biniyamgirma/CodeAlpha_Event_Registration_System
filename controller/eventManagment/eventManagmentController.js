const pool = require('../../database/connection');

const addEvent = (req, res) => {
    const {
    organizer_id,
    title,
    description,
    start_datetime,
    end_datetime,
    location,
    venue_name,
    address,
    city,
    state,
    country,
    google_map_link,
    is_online,
    online_event_url,
    max_attendees,
    registration_start,
    registration_end
    } = req.body;
    const eventImage = req.file ? req.file.path : null;
    const query = `INSERT INTO events (organizer_id, title, description, start_datetime, end_datetime, location, venue_name, address, city, state, country, google_map_link, is_online, online_event_url, event_image_url, max_attendees, registration_start, registration_end) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
        organizer_id,
        title,
        description,
        start_datetime,
        end_datetime,
        location,
        venue_name,
        address,
        city,
        state,
        country,
        google_map_link,
        is_online,
        online_event_url,
        eventImage,
        max_attendees,
        registration_start,
        registration_end
    ];
    pool.query(query, values, (error, results) => {
        if (error) {
            console.error('Error inserting event:', error);
            return res.status(500).json({ error: 'Database error' });
        }
        const eventId = results.insertId;
        res.status(201).json({ message: 'Event added successfully', eventId });
    }
    );
    
};
const getEventById = (req, res) => {
    const eventId = req.params.eventId;
    const query = 'SELECT * FROM events WHERE event_id = ?';
    pool.query(query, [eventId], (error, results) => {
        if (error) {
            console.error('Error fetching event:', error);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json(results[0]);
    });
};
const getEventsByOrganizerId = (req, res) => {
    const organizerId = req.params.organizerId;
    const query = 'SELECT * FROM events WHERE organizer_id = ?';
    pool.query(query, [organizerId], (error, results) => {
        if (error) {
            console.error('Error fetching events:', error);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
};
const updateEvent = (req, res) => {
    const eventId = req.params.eventId;
    const {
        organizer_id,
    title,
    description,
    start_datetime,
    end_datetime,
    location,
    venue_name,
    address,
    city,
    state,
    country,
    google_map_link,
    is_online,
    online_event_url,
    max_attendees,
    registration_start,
    registration_end
    } = req.body;
    const eventImage = req.file ? req.file.path : null;
    const query = `UPDATE events SET organizer_id = ?, title = ?, description = ?, start_datetime = ?, end_datetime = ?, location = ?, venue_name = ?, address = ?, city = ?, state = ?, country = ?, google_map_link = ?, is_online = ?, online_event_url = ?, event_image_url = ?, max_attendees = ?, registration_start = ?, registration_end = ? WHERE event_id = ?`;
    const values = [
        organizer_id,
        title,
        description,
        start_datetime,
        end_datetime,
        location,
        venue_name,
        address,
        city,
        state,
        country,
        google_map_link,
        is_online,
        online_event_url,
        eventImage,
        max_attendees,
        registration_start,
        registration_end,
        eventId
    ];
    pool.query(query, values, (error, results) => {
        if (error) {
            console.error('Error updating event:', error);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json({ message: 'Event updated successfully' });
    });
};
const deleteEvent = (req, res) => {
    const eventId = req.params.eventId;
    const query = 'UPDATE events SET is_active = false WHERE id = ? ';
    pool.query(query, [eventId], (error, results) => {
        if (error) {
            console.error('Error deleting event:', error);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json({ message: 'This event is now can not be accessed by users' });
    });
};


module.exports = {
    addEvent,
    getEventById,
    getEventsByOrganizerId,
    updateEvent,
    deleteEvent
};