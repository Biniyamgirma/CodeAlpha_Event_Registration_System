const bcrypt = require('bcrypt');

const saltRounds = 10;

const hashPassword = async(plainText)=>{
    if(typeof plainText === 'string'){
        try{
          const hash = await bcrypt.hash(plainText, saltRounds);
    console.log('Hashed Password:', hash);
            return hash;
        }catch(err){
            console.log(err.message);
        }
    }
}
const compare = async(plainText,cipherText)=>{
    return  await bcrypt.compare(plainText,cipherText);
}

module.exports = {
    compare,
    hashPassword
}