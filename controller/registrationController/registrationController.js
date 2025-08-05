const pool = require('../../database/connection')
const {discountAmount,calculateTax} = require('../../util/calculateDiscount')

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
        // Validate ticket exists and is available
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
        
        if (ticket.current_available > ticket.max_available) {
            return res.status(400).json({ message: 'No tickets available' });
        }

        // Handle discount code if provided
        let discountAmount = 0;
        let discountData = null;
        
        if (discount_code_id) {
            const discountQuery = 'SELECT * FROM discount_codes WHERE discount_code_id = $1';
            discountData = await pool.query(discountQuery, [discount_code_id]);
            
            if (discountData.rows.length === 0) {
                return res.status(400).json({ message: 'Discount code not found' });
            }
            
            const discount = discountData.rows[0];
            const now = new Date();
            const startDate = new Date(discount.start_date);
            const endDate = new Date(discount.end_date);
            
            if (!discount.is_active || now < startDate || now > endDate || discount.current_uses >= discount.max_uses) {
                return res.status(400).json({ message: 'Discount code not available' });
            }
            
            // Calculate discount amount (implement your discount calculation logic)
            discountAmount = calculateDiscount(discount.discount_value, ticket.price);
        }

        // Handle free tickets
        if (ticket.price === 0) {
            const freeTicket = {
                event_id,
                user_id,
                ticket_id,
                registration_date: registration_date || currentDate,
                status: 'paid',
                payment_status: 'completed',
                discount_code_id: discount_code_id || null,
                notes: notes || null,
                checked_in_at: null,
                accessibility_requirements: accessibility_requirements || null,
                ticket_qr_code: generateQRCode() // Implement your QR code generation
            };

            const insertQuery = `
                INSERT INTO registrations (
                    event_id, user_id, ticket_id, registration_date, 
                    status, payment_status, discount_code_id, notes, 
                    checked_in_at, accessibility_requirements, ticket_qr_code
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
                RETURNING *
            `;
            
            const result = await pool.query(insertQuery, [
                freeTicket.event_id,
                freeTicket.user_id,
                freeTicket.ticket_id,
                freeTicket.registration_date,
                freeTicket.status,
                freeTicket.payment_status,
                freeTicket.discount_code_id,
                freeTicket.notes,
                freeTicket.checked_in_at,
                freeTicket.accessibility_requirements,
                freeTicket.ticket_qr_code
            ]);

            return res.status(201).json({ 
                message: "Registration successful",
                registration: result.rows[0]
            });
        }

        // Handle paid tickets
        const registration = {
            event_id,
            user_id,
            ticket_id,
            registration_date: registration_date || currentDate,
            status: 'pending',
            discount_code_id: discount_code_id || null,
            notes: notes || null,
            accessibility_requirements: accessibility_requirements || null
        };

        // Start transaction for paid tickets
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');

            // Insert registration
            const regQuery = `
                INSERT INTO registrations (
                    event_id, user_id, ticket_id, registration_date, 
                    status, discount_code_id, notes, accessibility_requirements
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
                RETURNING registration_id
            `;
            
            const regResult = await client.query(regQuery, [
                registration.event_id,
                registration.user_id,
                registration.ticket_id,
                registration.registration_date,
                registration.status,
                registration.discount_code_id,
                registration.notes,
                registration.accessibility_requirements
            ]);

            const registrationId = regResult.rows[0].registration_id;

            // Calculate amounts
            const taxAmount = calculateTax(ticket.price - discountAmount); // Implement your tax calculation
            const totalAmount = ticket.price - discountAmount + taxAmount;

            // Insert invoice
            const invoiceQuery = `
                INSERT INTO invoices (
                    registration_id, invoice_number, due_date, 
                    total_amount, tax_amount, discount_amount, 
                    notes, payment_terms
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
                RETURNING *
            `;
            
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 7); // 7 days from now
            
            await client.query(invoiceQuery, [
                registrationId,
                `INV-${registrationId}`,
                dueDate.toISOString(),
                totalAmount,
                taxAmount,
                discountAmount,
                notes || null,
                'Payment due within 7 days'
            ]);

            await client.query('COMMIT');
            
            return res.status(201).json({ 
                message: "Registration successful. Payment required.",
                registration_id: registrationId
            });
        } catch (error) {
            await client.query('ROLLBACK');
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

function generateQRCode() {
    // Implement your QR code generation logic
    return "qr-code-data";
}
module.exports = {
    registrations
}