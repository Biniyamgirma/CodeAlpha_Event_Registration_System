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

module.exports = addEvent;