const {hashPassword,
    comparePassword} = require('../../helper/passwordHash/password');


// //@desc register a new user 
// //@route post /api/users/register
// //@access public  
const registerUser = (req,res) => {
    const {
    email,
    password,
    first_name,
    last_name,
    phone,
    profile_image_url
    } = req.body;
    if(!email || !password || !first_name || !last_name ) {
        return res.status(400).json({
            message: "Please provide all required fields: email, password, first_name, last_name"
        });
    }
    const hashedPassword = hashPassword(password);

    // i will write the logic to save the user in postgres database using orm

};



module.exports = {
  registerUser
};