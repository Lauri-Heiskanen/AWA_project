// this is mostly copied from Erno Vanhala's web-applications-week-8/auth/validateToken.js course material

const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers["authorization"];
  let token;
  if (authHeader) {
    token = authHeader.split(" ")[1];
  } else {
    token = null;
  }
  if (token == null) {
    return res.redirect(401, "/login");
  }
  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) return res.redirect(401, "/login");
    req.user = user;
    next();
  });
};
