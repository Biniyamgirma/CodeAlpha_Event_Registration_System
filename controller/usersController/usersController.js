const {hashPassword,
    comparePassword} = require('../../helper/passwordHash/password');
const {
    generateToken,
    verifyToken
} = require('../../util/jwtUtils');

const pool = require('../../database/connection');

// //@desc register a new user 
// //@route post /api/users/register
// //@access public  
const registerUser = async(req,res) => {
    const {
    email,
    password_hash,
    first_name,
    last_name,
    phone,
    profile_image_url,
    bio,
    last_login,
    } = req.body;
    if(!email || !password_hash || !first_name || !last_name || !phone){
        return res.status(400).json({error:'All fields are required'});
    }
    const hashedPassword = await hashPassword(profile_image_url);

    try{
        const newUser = await pool.query(`INSERT INTO users(email,password_hash,first_name,last_name,phone,profile_image_url,bio,last_login,role) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [email,hashedPassword,first_name,last_name,phone,profile_image,bio,last_login,role],(err,results)=>{
                if(err){
                    res.status(400).json({
                        error:err
                    });
                }else{
                    const user = results.rows[0];
                    res.status(201).json({
                        message:'User created successfully',
                        user:user
                    })
                }
            }
        );

    }catch(error){
        res.status(400).json({
            error:error
        })
    }
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
        pool.query(`SELECT * FROM users WHERE id = $1`,[id],(err,results)=>{
            if(err){
                res.status(400).json({
                    error:err
                })
            }
            const user = results.rows[0];
            const isMatch = comparePassword(oldPassword,user.password_hash);
            if(isMatch){
                const hashedPassword = hashPassword(newPassword);
                pool.query(`UPDATE users SET password_hash = $1 WHERE id = $2`,[hashedPassword,id], (err,results)=>{
                    if(err){
                        res.status(400).json({
                            error:err
                        })
                    }
                    res.status(200).json({
                        message:'Password changed successfully'
                    });
                })
            }else{
                res.status(400).json({
                    message:'Old password is incorrect'
                })
            }
      }  );
        }catch(error){
        res.status(400).json({
            error:error
        })  
    }
}
//@desc for sending jwt token users to login 
//route post /api/user/login
//access public for know
const loginUser = async(req,res)=>{
    const { email, password} = req.body;
    if(!email || !password){
        res.status(400).json({
            message:"Email and password is required"
        })
    }
    try {
        const data = await pool.query(`SELECT * FROM users WHERE email = $1`,[email]);
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
            token:token,
            userData:data.rows[0]
        })
        
    } catch (error) {
        res.status(400).json({
            message:'error in login',
            error:error
        })
    }
}

const deleteAccount = async(req,res)=>{
    const {id} = req.params;    
    try {
     await pool.query(`UPDATE users SET is_active = false WHERE id = $1`,[id],(err,results)=>{
        if(err){
            res.status(400).json({
                error:err
            })
        }
    });
} catch(error){
    res.status(400).json({
        error:error
    })
}
}
const changeInfo = (req,res)=>{
    const {id} = req.params;
    const {
        email,
    password_hash,
    first_name,
    last_name,
    phone,
    profile_image_url,
    bio,
    last_login
    } = req.body;   
     pool.query(`UPDATE users SET email = $1,password_hash = $2,first_name = $3,last_name = $4,phone = $5,profile_image_url = $6,bio = $7,last_login = $8 WHERE id = $9`,
        [
            email,
            password_hash,
            first_name,
            last_name,
            phone,
            profile_image_url,
            bio,
            last_login,
            id
        ],(err,results)=>{
            if(err){
                res.status(400).json({
                    error:err
                })
            }
            res.status(200).json({
                message:'User info updated successfully'
            })
        }
     )
}



module.exports = {
  registerUser,
  loginUser,
  changePassword,
  deleteAccount,
  changeInfo
}