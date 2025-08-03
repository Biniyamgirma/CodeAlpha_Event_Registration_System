const pool = require('../../database/connection');

//@desc admin registration function
//@route /api/organizer/register
//@access only admin can access 
const assignAdminPrivelage= async(req,res)=>{
    const {id,role} = req.body;
    if(!id || !role){
        res.status(300).json({
            message:'id or role missing'
        })
    }
    role = role.toString().toLowerCase();
    //write a logic to update the privilage of the selected user id
    await pool.query('UPDATE users SET role = $1 WHERE id = $2', [role, id], (error, results) => {
        if (error) {
            return res.status(500).json({
                message: 'Error updating user role',
                error: error.message
            });
        }
    });
    res.status(200).json({
        message: 'User role updated successfully',
        userId: id,
        newRole: role
    });
}
const registerOrganizer = async(req,res)=>{
    const {
    user_id,
    company_name,
    job_title,
    contact_phone,
    company_address,
} = req.body;
    if(!user_id || !company_name || !job_title || !contact_phone || !company_address){
        req.status(400).json({
            message:"bad request all fileds required"
        })
    }
    //database insert logic
    await pool.query('INSERT INTO event_organizers (user_id, company_name, job_title, contact_phone, company_address) VALUES ($1, $2, $3, $4, $5)', 
    [user_id, company_name, job_title, contact_phone, company_address], (error, results) => {
        if (error) {
            return res.status(500).json({
                message: 'Error inserting organizer',
                error: error.message
            });
        }
    });
    res.status(200).json({
        message: 'Organizer registered successfully'
    });

}

const blockUser = async(req,res)=>{
    const {id} = req.body;
    if(!id){
        res.status(400).json({
            message:'id is required to block a user'
        })
    }
    //write a logic to block the user
   await pool.query('UPDATE users SET is_active = false WHERE id = $1', [id], (error, results) => {
        if (error) {
            return res.status(500).json({
                message: 'Error blocking user',
                error: error.message
            });
        }
    });
    res.status(200).json({
        message: 'User blocked successfully'
    });
}
const blockOrganizer = async(req,res)=>{
    const {id} = req.body;
    if(!id){
        res.status(400).json({
            message:'id is required to block a organizer'
        })
    }
    //write a logic to block the organizer
   await pool.query('UPDATE event_organizers SET is_active = false WHERE user_id = $1', [id], (error, results) => {
        if (error) {
            return res.status(500).json({
                message: 'Error blocking organizer',
                error: error.message
            });
        }
    });
    res.status(200).json({
        message: 'Organizer blocked successfully'
    });
}
const verifyOrganizer = async(req,res)=>{
    const {id} = req.body;
    if(!id){
        res.status(400).json({
            message:'id is required to verify a organizer'
        })
    }
    //write a logic to verify the organizer
   await pool.query('UPDATE event_organizers SET is_verified = true WHERE user_id = $1', [id], (error, results) => {
        if (error) {
            return res.status(500).json({
                message: 'Error verifying organizer',
                error: error.message
            });
        }
    });
    res.status(200).json({
        message: 'Organizer verified successfully'
    });
}
const verifyUser = async(req,res)=>{
    const {id} = req.body;
    if(!id){
        res.status(400).json({
            message:'Id is required to verify User'
        })
    }
    //write a logic to verify the user
    await pool.query('UPDATE users SET is_verified = true WHERE id = $1', [id], (error, results) => {
        if (error) {
            return res.status(500).json({
                message: 'Error verifying user',
                error: error.message
            });
        }
    });
    res.status(200).json({
        message: 'User verified successfully'
    });
}

module.exports = {
    verifyOrganizer,
    verifyUser,
    blockOrganizer,
    blockUser,
    registerOrganizer,
    assignAdminPrivelage
};