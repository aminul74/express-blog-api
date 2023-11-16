const User = require(".././models/user.model");

const signUpRepo = async (email) =>{
   try {
      
    const findUserWithEmail = await User.findOne({ where: { email: email } });
    
    return findUserWithEmail;
    
   } catch (error) {
    return error;
   }
}

module.exports = signUpRepo;

