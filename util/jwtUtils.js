const jsonwebtoken = require('jsonwebtoken');

const secretKey = process.env.SUPER_SECRET_CODE || "123";
// Function to generate JWT token
const generateToken = (user)=>{
    const playLoad = {
        id: user.id,
        email: user.email,
        role: user.role // Assuming user object has a role property
    };

    const options = {
        expiresIn: '2d' // Token expiration time
    };

    const token = jsonwebtoken.sign(playLoad, secretKey, options);
    return token;
}

// Function to verify JWT token
const verifyToken = (token) => {
    try {
        return jsonwebtoken.verify(token,secretKey);
    }catch (error) {
        console.error("Error verifying token:", error);
        throw error;
    }
}
module.exports = {
    generateToken,
    verifyToken
}