const pool = require('../../database/connection');
const { get } = require('../../router/authRoute/authRoute');

const getTicketsByEventId = (req, res) => {
    const eventId = parseInt(req.params.eventId);
    pool.query('SELECT * FROM tickets WHERE event_id = $1', [eventId], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json(results.rows)
    })
}
const getTicketById = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query('SELECT * FROM tickets WHERE ticket_id = $1', [id], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        if (results.rows.length === 0) {
            res.status(404).json({ message: 'Ticket not found' });
            return;
        }
        res.status(200).json(results.rows[0]);
    });
}

module.exports = {
    getTicketsByEventId,
    getTicketById
}