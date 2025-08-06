const pool = require('../../database/connection')
const {calculateDiscount,calculateTax} = require('../../util/calculateDiscount')

const currentDate = new Date();
const expirationDate = new Date(currentDate);
expirationDate.setDate(currentDate.getDate() + 2);
const registrationValue = {
    registration_id:0,
    invoice_number:"",
    due_date:expirationDate.toISOString(),
    total_amount:0,
    tax_amount:15,
    discount_amount:0,
    status:"draft",
    notes:" ",
    payment_terms:"This invoice will expire after 2 days"
}
const registrations = async (req, res) => {
    const currentDate = new Date().toISOString();
    const {
        event_id,
        user_id,
        ticket_id,
        registration_date,
        discount_code_id,
        notes,
        accessibility_requirements
    } = req.body;

    try {
        // 1. Validate Ticket
        const ticketQuery = 'SELECT price, is_active, available_until, max_available, current_available FROM tickets WHERE ticket_id = $1';
        const ticketData = await pool.query(ticketQuery, [ticket_id]);
        
        if (ticketData.rows.length === 0) {
            return res.status(400).json({ message: 'Ticket not found' });
        }

        const ticket = ticketData.rows[0];
        
        if (!ticket.is_active) {
            return res.status(400).json({ message: 'Ticket is not active' });
        }
        
        if (new Date(ticket.available_until) < new Date()) {
            return res.status(400).json({ message: 'Ticket has expired' });
        }
        
        if (ticket.current_available <= 0) { // Fixed logic
            return res.status(400).json({ message: 'No tickets available' });
        }

        // 2. Handle Discount Code
        let discountAmount = 0;
        if (discount_code_id) {
            const discountQuery = 'SELECT * FROM discount_codes WHERE discount_code_id = $1';
            const discountData = await pool.query(discountQuery, [discount_code_id]);
            
            if (discountData.rows.length === 0) {
                return res.status(400).json({ message: 'Discount code not found' });
            }
            
            const discount = discountData.rows[0];
            const now = new Date();
            
            if (!discount.is_active || 
                now < new Date(discount.start_date) || 
                now > new Date(discount.end_date) || 
                discount.current_uses >= discount.max_uses) {
                return res.status(400).json({ message: 'Discount code not valid' });
            }
            
            discountAmount = calculateDiscount(discount.discount_value, ticket.price);
        }

        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');

            // 3. Handle Free Tickets
            if (parseInt(ticket.price) === 0) {
                const freeTicket = {
                    event_id: event_id || null,
                    user_id: user_id || null,
                    ticket_id: ticket_id || null,
                    registration_date: registration_date || currentDate,
                    discount_code_id: discount_code_id || null,
                    notes: notes || null,
                    checked_in_at: null,
                    accessibility_requirements: accessibility_requirements || null,
                    ticket_qr_code: generateQRCode()
                };

                const insertQuery = `
                    INSERT INTO registrations (
                        event_id, user_id, ticket_id, registration_date, 
                        discount_code_id, notes, 
                        checked_in_at, accessibility_requirements, ticket_qr_code
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
                    RETURNING *
                `;
                
                const result = await client.query(insertQuery, [
                    freeTicket.event_id,
                    freeTicket.user_id,
                    freeTicket.ticket_id,
                    freeTicket.registration_date,
                    freeTicket.discount_code_id,
                    freeTicket.notes,
                    freeTicket.checked_in_at,
                    freeTicket.accessibility_requirements,
                    freeTicket.ticket_qr_code
                ]);

                // Update ticket availability
                await client.query(
                    'UPDATE tickets SET current_available = current_available - 1 WHERE ticket_id = $1',
                    [ticket_id]
                );

                await client.query('COMMIT');
                return res.status(201).json({ 
                    message: "Registration successful",
                    registration: result.rows[0].registration_id
                });
            }

            // 4. Handle Paid Tickets
            const regQuery = `
                INSERT INTO registrations (
                    event_id, user_id, ticket_id, registration_date, 
                    status, discount_code_id, notes, accessibility_requirements
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
                RETURNING registration_id
            `;
            
            const regResult = await client.query(regQuery, [
                event_id,
                user_id,
                ticket_id,
                registration_date || currentDate,
                'pending',
                discount_code_id || null,
                notes || null,
                accessibility_requirements || null
            ]);

            const registrationId = regResult.rows[0].registration_id;
            const taxAmount = calculateTax(ticket.price - discountAmount);
            const totalAmount = ticket.price - discountAmount + taxAmount;

            // Create invoice
            const invoiceQuery = `
                INSERT INTO invoices (
                    registration_id, invoice_number, due_date, 
                    total_amount, tax_amount, discount_amount, 
                    notes, payment_terms
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
                RETURNING invoice_id
            `;
            
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 7);
            
            const invoiceResult = await client.query(invoiceQuery, [
                registrationId,
                `INV-${registrationId}`,
                dueDate.toISOString(),
                totalAmount,
                taxAmount,
                discountAmount,
                notes || null,
                'Payment due within 7 days'
            ]);

            // Update ticket availability
            await client.query(
                'UPDATE tickets SET current_available = current_available - 1 WHERE ticket_id = $1',
                [ticket_id]
            );

            await client.query('COMMIT');
            return res.status(201).json({ 
                message: "Registration successful. Payment required.",
                registration_id: registrationId,
                invoice_id: invoiceResult.rows[0].invoice_id
            });
            
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Transaction error:', error);
            throw error;
        } finally {
            client.release();
        }
        
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ 
            message: 'Registration failed',
            error: error.message 
        });
    }
};
const getRegisteredTickets = async(req,res) =>{
    let {registrationId} = req.params;
    console.log(registrationId);
    try{
        const query = `SELECT * FROM registrations WHERE registration_id = $1`
        const value = [registrationId]
       const data = await pool.query(query,value);
       if(data.rows.length === 0){
        return res.status(404).json({
            message:"Registration not found"
        })
       }
       res.status(200).json({
    message:data.rows[0]    
    })
    }catch(error){
        res.status(400).json({
            message:error.message
        })
    }

}
function generateQRCode() {
    // Implement your QR code generation logic
    return "qr-code-data";
}
//helper function for updating count in database
function updateNumberofUsage (ticket_id,current_available){
    const query = `UPDATE current_available = $1 FROM tickets WHERE ticket_id = $2`;
    const values= [ticket_id,current_available];
    return pool.query(query,values);
}
const cancelRegistration = (req,res)=>{
    const {registrationId} = req.params;
    const query = `UPDATE registrations SET status = 'cancelled' WHERE registration_id = $1`
    const value = [registrationId]
    try{
        pool.query(query,value);
        res.status(200).json({message:'Your registration has been canceled.'});
    }catch(error){
        res.status(400).json({message:"error occured"})
    }
    
}
module.exports = {
    registrations,
    getRegisteredTickets,
    cancelRegistration
}