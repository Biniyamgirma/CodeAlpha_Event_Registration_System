const pool = require('../../database/connection')

const addTicket = (req, res) => {
    const {
    event_id,
    name,
    description,
    price,
    available_from ,
    available_until,
    max_available,
    current_available,
    includes_lunch,
    includes_dinner,
    includes_materials,
    seat_no } = req.body;
    if(!event_id || !name || !description || !price || !available_from || !available_until || !max_available || !current_available || !seat_no){
        return res.status(400).json({ error: 'All fields are required' });
    }
    pool.query(`INSERT INTO tickets (event_id, name, description, price, available_from,available_until,max_available,current_available,includes_lunch,includes_dinner,includes_materials,seat_no) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`, [event_id, name, description, price, available_from ,available_until,max_available,current_available,includes_lunch,includes_dinner,includes_materials,seat_no], (error, results) => {
        if (error) {
          return  res.status(500).json({ error: error.message });
        }
        res.status(201).json({message: 'Ticket added successfully', ticket: results.rows[0] });
      });
}
const updateTicket = (req, res) => {
    const { ticketId } = req.params;
    const {
    event_id,
    name,
    description,
    price,
    available_from ,
    available_until,
    max_available,
    current_available,
    includes_lunch,
    includes_dinner,
    includes_materials,
    seat_no} = req.body;
    
    pool.query(`UPDATE tickets SET event_id = $1, name = $2, description = $3, price = $4, available_from = $5, available_until = $6, max_available = $7, current_available = $8, includes_lunch = $9, includes_dinner = $10, includes_materials = $11, seat_no = $12 WHERE ticket_id =$13 RETURNING *`,
         [event_id, name, description, price, available_from,available_until,max_available,current_available,includes_lunch,includes_dinner,includes_materials,seat_no, ticketId], (error, results) => {
        if (error) {
          return  res.status(500).json({ error: error.message });
        }
        res.status(200).json({message: 'Ticket updated successfully', ticket: results.rows[0] });
      });
}
const deleteTicket = (req, res) => {
    const { ticketId } = req.params;
    if(!ticketId){
        return res.status(400).json({ error: 'Ticket id is required' });
    }
    pool.query(`UPDATE tickets SET is_active = false WHERE ticket_id = $1 RETURNING *`, [ticketId], (error, results) => {
        if (error) {
          return  res.status(500).json({ error: error.message });
        }
        res.status(200).json({message: 'Ticket deleted successfully', ticket: results.rows[0] });
      });
}
const activateTicket = (req, res) => {
    const { ticketId } = req.params;
    if(!ticketId){
        return res.status(400).json({ error: 'Ticket id is required' });
    }
    pool.query(`UPDATE tickets SET is_active = true WHERE ticket_id =$1 RETURNING *`, [ticketId], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(200).json({message: 'Ticket activated successfully', ticket: results.rows[0] });
      })
 };
const getTicketByEentId = (req, res) => {
    const { eventId } = req.params;
    if(!eventId){
        return res.status(400).json({ error: 'Event id is required' });
    }
    pool.query(`SELECT * FROM tickets WHERE event_id = $1`, [eventId], (error, results) => {
        if (error) {
          return  res.status(500).json({ error: error.message });
        }
        res.status(200).json({message: 'Tickets fetched successfully', tickets: results.rows });
      });
}
const getTicketById = (req, res) => {
    const { ticketId } = req.params;
    if(!ticketId){
        return res.status(400).json({ error: 'Ticket id is required' });
    }
    pool.query(`SELECT * FROM tickets WHERE ticket_id = $1`, [ticketId], (error, results) => {
        if (error) {
            return  res.status(500).json({ error: error.message });
        }
        res.status(200).json({message: 'Ticket fetched successfully', ticket: results.rows[0] });
      });
    }
 module.exports = {
    addTicket,
    updateTicket,
    deleteTicket,
    activateTicket,
    getTicketByEentId,
    getTicketById
 }