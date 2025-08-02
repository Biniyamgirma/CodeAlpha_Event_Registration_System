const bcrypt = require('bcrypt');

// Function to hash a password
const saltRounds = 10;
const hashPassword = async (password)=>{
    try {
        const hasedPassword = await bcrypt.hash(password,saltRounds);
        return hasedPassword;
    }catch (error) {
        console.error("Error hashing password:", error);
        throw error;
    }
}

const comparePassword = async (password, hashedPassword) => {
    try{
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    }catch (error){
        console.error("Error comparing password:", error);
        throw error;
    }
}

module.exports = {
    hashPassword,
    comparePassword
}

