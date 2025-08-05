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
    bio
    } = req.body;
    if(!email || !password_hash || !first_name || !last_name || !phone){
        return res.status(400).json({error:'All fields are required'});
    }
    const profile_image_url = req.file ? req.file.filename : null;
    
    const hashedPassword = await hashPassword(password_hash);
    last_login = new Date();
    try{
        const newUser = pool.query(`INSERT INTO users(email,password_hash,first_name,last_name,phone,profile_image_url,bio,last_login) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [email,hashedPassword,first_name,last_name,phone,profile_image_url,bio,last_login],(err,results)=>{
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
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    try {
        // 1. Await the database query
        const { rows } = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
        
        // 2. Check if user exists (rows[0] contains the user)
        if (rows.length === 0) {
            return res.status(404).json({
                message: "Email doesn't exist"
            });
        }

        const user = rows[0];
        
        // 3. Check if password_hash exists
        if (!user.password_hash) {
            return res.status(400).json({
                message: "No password set for this user"
            });
        }

        // 4. Compare passwords
        const isMatch = await comparePassword(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ // 401 is more appropriate for auth failures
                message: 'Password incorrect'
            });
        }

        // 5. Generate token
        const userData = {
            id: user.id,
            email: user.email,
            role: user.role
        };
        const token = generateToken(userData);
        const lastLogin = new Date();
        if(user.is_active === false){
            return res.status(401).json({message:'you havebeen blocked from the system'});
        }
        await pool.query('UPDATE last_login=$1 FROM users WHERE user_id=$2',[lastLogin,user.user_id],(error,results)=>{
            
            const userData = {
            user_id:user.user_id,
            email:user.email,
            first_name:user.first_name,
            last_name:user.last_name,
            phone:user.phone,
            profile_image_url:user.profile_image_url,
            bio:user.bio,
            is_verified:user.is_verified,
            role:user.role
        }
        res.status(200).json({
            message: "User logged in successfully",
            token: token,
            userData: userData 
        });
        });
        
        
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            message: 'Error in login',
            error: error.message 
        });
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