const db = require("../connections/connections.js");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { _updateSessionID } = require("../modules/users.js");
const { createToken } = require("../controllers/users.js");

dotenv.config();

const checkUser = (req, res, next) => {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];
  if (token === undefined || token === null)
    return res.json({ error: "token null" });
  jwt.verify(token, process.env.JWT_TOKEN, (error, user) => {
    if (error) return res.json({ error: error.message, status: false });
    req.user = user.id;
    res.json({ status: true });
    next();
  });
};

const refToken = (req, res, next) => {
  try {
    const refToken = req.cookies.token;
    if (refToken === null)
      return res.status(401).json({ error: "null ref token" });
    jwt.verify(refToken, process.env.JWT_REFRESH_TOKEN, (error, user) => {
      if (error)
        return res.status(403).json({ error: error.message, status: false });
      let tokens = createToken(user.id);

      _updateSessionID(user.id, tokens.accessToken)
        .then((data) => {
          return res
            .status(201)
            .cookie("token", tokens.refToken, {
              withCredentials: true,
              httpOnly: true,
            })
            .json({ status: true, renew: "renewed" });
        })
        .catch((err) => console.log(err));
    });
  } catch (error) {
    return res.status(401).json({ error: error.message, status: false });
  }
};

module.exports = { checkUser, refToken };
