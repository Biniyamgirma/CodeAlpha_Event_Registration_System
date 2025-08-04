const pool = require('./../../database/connection');

const addDiscount = async (req, res) => {
    const { discount_code_id ,
    code,
    description ,
    discount_type,
    discount_value ,
    start_date,
    end_date,
    max_uses,
    current_uses,
    is_active,
    created_by,
    created_at,} = req.body;
    try {
        const newDiscount = await pool.query(`INSERT INTO discount_codes (discount_code_id, code, description, discount_type, discount_value, start_date, end_date, max_uses, current_uses, is_active, created_by, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
            [discount_code_id, code, description, discount_type, discount_value, start_date, end_date, max_uses, current_uses, is_active, created_by, created_at]);
        res.status(201).json(newDiscount.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const getDiscountById = async (req, res) => {
    const { discountId } = req.params;
    try {
        const discount = await pool.query(`SELECT * FROM discount_codes WHERE discount_code_id = $1`, [discountId]);
        if (discount.rows.length === 0) {
            return res.status(404).json({ error: 'Discount not found' });
        }
        res.json(discount.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const updateDiscount = async (req, res) => {
    const { discountId } = req.params;
    const { code, description, discount_type, discount_value, start_date, end_date, max_uses, current_uses, is_active } = req.body;
    try {
        const updatedDiscount = await pool.query(`UPDATE discount_codes SET code = $1, description = $2, discount_type = $3, discount_value = $4, start_date = $5, end_date = $6, max_uses = $7, current_uses = $8, is_active = $9 WHERE discount_code_id = $10 RETURNING *`,
            [code, description, discount_type, discount_value, start_date, end_date, max_uses, current_uses, is_active, discountId]);
            if (updatedDiscount.rows.length === 0) {
                return res.status(404).json({ error: 'Discount not found' });
            }
            res.json(updatedDiscount.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const deleteDiscount = async (req, res) => {
    const { discountId } = req.params;
    try {
        const deletedDiscount = await pool.query(`UPDATE discount_codes SET is_active = false WHERE discount_code_id = $1 RETURNING *`, [discountId]);
        if (deletedDiscount.rows.length === 0) {
            return res.status(404).json({ error: 'Discount not found' });
        }
        res.json(deletedDiscount.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const getActiveDiscounts = async (req, res) => {
    try {
        const activeDiscounts = await pool.query(`SELECT * FROM discount_codes WHERE is_active = true`);
        res.json(activeDiscounts.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const activateDiscountById = async (req, res) => {
    const { discountId } = req.params;
    try {
        const activatedDiscount = await pool.query(`UPDATE discount_codes SET is_active = true WHERE discount_code_id = $1 RETURNING *`, [discountId]);
        if (activatedDiscount.rows.length === 0) {
            return res.status(404).json({ error: 'Discount not found' });
        }
        res.json(activatedDiscount.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getDiscountByOrganizerId = async (req, res) => {
    const { organizerId } = req.params;
    try {
        const discounts = await pool.query(`SELECT * FROM discount_codes WHERE created_by = $1`, [organizerId]);
        res.json(discounts.rows);
    } catch (error) {   
        res.status(500).json({ error: 'Internal server error' });
    }
};

const eventDiscountMapping = async (req, res) => {
    const { eventId , discount_code_id } = req.body;
    //first lets check if the issued discount is and the user is authorized to make a discount to an event

    if (!eventId || !discountId) {
        return res.status(400).json({ error: 'Event ID and discount ID are required' });
    }
    try {
        const event = await pool.query(`SELECT * FROM events WHERE event_id = $1`, [eventId]);
        if (event.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }
        const discount_code_id = await pool.query(`SELECT * FROM discount_codes WHERE discount_code_id = $1`, [discountId]);
        if (discount_code_id.rows.length === 0) {   
            return res.status(404).json({message: 'Discount not found' })
        }
        const checkForAuthorization = event.organizer_id === discount_code_id.created_by;
        if (!checkForAuthorization) {
            return res.status(403).json({ error: 'You are not authorized to issue this discount to this event' });
        }
        const eventDiscountMapping = await pool.query(`INSERT INTO event_discount_codes (event_id, discount_code_id) VALUES ($1, $2) RETURNING *`, [eventId, discountId]);
        res.status(201).json(eventDiscountMapping.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getDiscountByEventId = async (req, res) => {
    const { eventId } = req.params;
    if(!eventId) return res.status(400).json({ error: 'Event ID is required' });
    try {
        const discounts = await pool.query(`SELECT * FROM event_discount_codes WHERE event_id = $1`, [eventId]);
        res.json(discounts.rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};




    

module.exports = {
    addDiscount,
    getDiscountById,
    updateDiscount,
    deleteDiscount,
    getActiveDiscounts,
    activateDiscountById,
    getDiscountByOrganizerId,
    eventDiscountMapping,
    getDiscountByEventId
};