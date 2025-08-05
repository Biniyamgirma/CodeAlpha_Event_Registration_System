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
const registrations = async(req, res)=>{
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
        const ticketData = await pool.query('SELECT price, is_active,available_until,max_available,current_available FROM tickets WHERE ticket_id = $1',[ticket_id]);
    if(ticketData.rows.length === 0){
        return res.status(400).json({message:'Ticket is not avalable'})
    }
    if(ticketData.rows[0].is_active === false){
        return res.status(400).json({message:'Ticket is not avalable'})
    }else if(ticketData.rows[0].available_until < currentDate){
        return res.status(400).json({message:'Ticket is not avalable'})
    }else if(ticketData.rows[0].max_available < ticketData.rows[0].current_available){
        return res.status(400).json({message:'No ticket available'})
    }

    if(!discount_code_id){
        registrationValue.discount_amount = 0;
    }else{
        const  discountData = await pool.query('SELECT * FROM discount_codes WHERE discount_code_id = $1',[discount_code_id]);
        if(discountData.rows.length === 0){
          return  res.status(400).json({message:'Discount code is not avalable'})
        }
        if(discountData.rows[0].is_active === false && discountData.rows[0].end_date < currentDate && discountData.rows[0].start_date > currentDate && discountData.rows[0].max_uses >= discountData.rows[0].current_uses){
            return res.status(400).json({message:'Discount code currently unavalabel'})
        }
    }
    if(ticketData.rows[0].price === 0){// pice is zero or the event is for free
        const freeTicket = {
    event_id:event_id,
    user_id:user_id,
    ticket_id:ticket_id,
    registration_date:registration_date,
    status:'paid',
    payment_status:'completed',
    discount_code_id:null,
    notes:null,
    checked_in_at:currentDate,
    accessibility_requirements:null,
    ticket_qr_code:""
        };
        await pool.query('INSERT INTO registrations (event_id,user_id,ticket_id,registration_date,status,payment_status,discount_code_id,notes,checked_in_at,accessibility_requirements,ticket_qr_code) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *',
            [
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
            ],(error,results)=>{
                if(error){
                    return res.status(400).json({error:error.message})
                }
                res.status(200).json({message:"you Havebeen Registered Successfully"})
            })
    }
    else{
        const payment = true;
         await  pool.query('INSERT INTO registrations (event_id,user_id,ticket_id,registration_date,status,discount_code_id,notes,accessibility_requirements) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
        [
            event_id,
            user_id,
            ticket_id,
            registration_date,
            status,
            discount_code_id,
            notes,
            accessibility_requirements
        ],(error,results)=>{
            if(error){
                res.status(400).json({error:error.message})
            }
             registrationValue.registration_id = results.row[0].registration_id;
            registrationValue.invoice_number =  `INV-${registrationId}`;
            registrationValue.discount_amount = discountAmount(discountData.rows[0].discount_value,ticketData.rows[0].price);
            registrationValue.tax_amount = calculateTax(registrationValue.tax_amount,registrationValue.total_amount);
            registrationValue.total_amount = ticketData.rows[0].price - registrationValue.discount_amount + registrationValue.tax_amount;

            pool.query(`INSERT INTO invoices (registration_id,invoice_number,due_date,total_amount,tax_amount,discount_amount,notes,payment_terms) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [
               registrationValue.registration_id,
               registrationValue.invoice_number,
               registrationValue.due_date,
               registrationValue.total_amount,
               registrationValue.tax_amount,
               registrationValue.discount_amount,
               registrationValue.notes,
               registrationValue.payment_terms
                
            ],(error,results)=>{
                if(error){
                    res.status(400).json({error:error.message})
                }
                return res.status(200).json({message:"you Havebeen Registered Successfully"})
            }
            );
        }
    );
    }
    }catch (error) {
       return res.status(400).json({message:'server error'})
    }
 
}