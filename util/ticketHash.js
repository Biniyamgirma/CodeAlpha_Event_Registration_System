const jsonwebtoken = require('jsonwebtoken');

const secretKey = process.env.SUPER_SECRET_CODE || "123";
//function to generate JWT token for ticket

const generateRegistrationToken = (registration) =>{

    //before  generating token, i need to get events expiration date and is the ticket active other details
    //to include in the token payload
    if(!registration || !registration.id || !registration.eventId) {
        throw new Error("Invalid registration data");
    }
    const playLoad = {
        id: registration.id,
        firstName: registration.firstName,
        lastName: registration.lastName,
        eventId: registration.eventId,
        eventName: registration.eventName,
        ticketId: registration.ticketId,
        ticketName: registration.ticketName
    }
    const options = {
        expiresIn: '30d'
    }
    const token = jsonwebtoken.sign(playLoad, secretKey, options);
    return token;
}

const verifyRegistrationToAnEvent = (token) => {
     try {
        return jsonwebtoken.verify(token, secretKey);
     }catch (error) {
        console.error("Error verifying registration token:", error);
        throw error;
     }
}

module.exports = {
    generateRegistrationToken,
    verifyRegistrationToAnEvent
}