const jwt = require("jsonwebtoken");

module.exports = {

isLoggedIn: (req, res, next) => {
  const token = req.cookies.access_token3;
  if (!token) {
    return res.status(401).send({
      msg: 'Cookie is not available'
    });
  }
  try {
    const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userData = data
    return next();
  } catch (err) {
    return res.status(401).send({
      msg: 'Session is not valid'
    });
  }
}
  
};




