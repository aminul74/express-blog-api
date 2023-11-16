const bcrypt = require("bcrypt");
const logInRepo = require("../../repositories/login.repo")
const jwtToken = require("../../utils/JWT");

const logIn = async (username, password) => {

    try {
        
        const user = await logInRepo(username);
        if (!user) return null;
      
        const isValid = await bcrypt.compare(password, user.password);
      
        if (!isValid) return null;

        const token = jwtToken(username);
        return token;
        
    } catch (error) {
        
    }

};

module.exports = logIn;
