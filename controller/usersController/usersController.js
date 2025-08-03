const {hashPassword,
    comparePassword} = require('../../helper/passwordHash/password');
const {
    generateToken,
    verifyToken
} = require('../../util/jwtUtils');


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

//@desc for changing password
//@route post /api/user/reset-password
//access public for know
const changePassword = (req,res)=>{
    const { id, oldPassword, newPassword} = req.body;
    if(!id || !oldPassword || !newPassword) {
        return res.status(400).json({
            message:'somting missing check for id, oldPassword and newPassword'
        });
    }
    try {
        //data base logic
    }catch(error){
        
    }
}
//@desc for sending jwt token users to login 
//route post /api/user/login
//access public for know
const loginUser = (req,res)=>{
    const { email, password} = req.body;
    if(!email || !password){
        res.status(400).json({
            message:"Email and password is required"
        })
    }
    try {
        //const {data} = //a function to access userid from  postgersql database;

        if(!data){
            res.status(400).json({
                message:"Email does't exsist"
            })
        }
        const isMatch = comparePassword(password,data.password_hash);

        if(!isMatch){
            res.status(301).json({
                message:'Password incorrect'
            })
        }
        const userData = {
            id:data.id,
            email:data.email,
            role:data.role
        };
        const token = generateToken(userData);

        res.status(200).json({
            message:"User login succsusfuly",
            token:token
        })
        
    } catch (error) {
        res.status(400).json({
            message:'error in login',
            error:error
        })
    }
}




module.exports = {
  registerUser,
  assignAdminPrivelage,
  loginUser,
  changePassword,
  verifyOrganizer,
  verifyUser,
  blockOrganizer,
  blockUser,
  registerOrganizer
};