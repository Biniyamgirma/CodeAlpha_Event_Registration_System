//@desc admin registration function
//@route /api/organizer/register
//@access only admin can access 
const assignAdminPrivelage=(req,res)=>{
    const {id,role} = req.body;
    if(!id || !role){
        res.status(300).json({
            message:'id or role missing'
        })
    }
    //write a logic to update the privilage of the selected user id
}
const registerOrganizer =(req,res)=>{
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

}

const blockUser = (req,res)=>{
    const {id} = req.body;
    if(!id){
        res.status(400).json({
            message:'id is required to block a user'
        })
    }
}
const blockOrganizer = (req,res)=>{
    const {id} = req.body;
    if(!id){
        res.status(400).json({
            message:'id is required to block a organizer'
        })
    }
}
const verifyOrganizer = (req,res)=>{
    const {id} = req.body;
    if(!id){
        res.status(400).json({
            message:'id is required to verify a organizer'
        })
    }
}
const verifyUser = (req,res)=>{
    const {id} = req.body;
    if(!id){
        res.status(400).json({
            message:'id is required to verify a organizer'
        })
    }
}

module.exports = {
    verifyOrganizer,
    verifyUser,
    blockOrganizer,
    blockUser,
    registerOrganizer,
    assignAdminPrivelage
};