const { Whitelist } = require("./Whitelist.js");

const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (Whitelist.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
};

module.exports = credentials;
