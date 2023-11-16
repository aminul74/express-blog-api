const User = require(".././models/user.model");

const logInRepo = async (username) =>{
   try {
      
    const findUserWithUserName = await User.findOne({where: { username: username }});
    
    return findUserWithUserName;

   } catch (error) {
    return error;
   }
}

module.exports = logInRepo;