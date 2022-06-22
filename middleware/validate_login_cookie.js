const jwt = require("jsonwebtoken");

module.exports = {

<<<<<<< HEAD
isLoggedIn: (req, res, next) => {
=======
isLoggedIn: async (req, res, next) => {
>>>>>>> d8451a8219e34b8ead58cf572d812b493b10ea3f
  const token = req.cookies.access_token3;
  if (!token) {
    return res.status(401).send({
      msg: 'Cookie is not available'
    });
  }
  try {
<<<<<<< HEAD
    const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
=======
    const data = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
>>>>>>> d8451a8219e34b8ead58cf572d812b493b10ea3f
    req.userData = data
    return next();
  } catch (err) {
    return res.status(401).send({
      msg: 'Session is not valid'
    });
  }
}
  
};




