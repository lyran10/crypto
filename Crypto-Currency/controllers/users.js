const {
  _createUser,
  _checkUserExists,
  _userLogin,
  _updateSessionID,
  _token,
  _removeToken,
} = require("../modules/users.js");
const db = require("../connections/connections.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const refTokenTime = 24 * 60 * 60 * 1000;
const accessTokenTime = 60 * 60 * 1000;

const createToken = (id) => {

  const accessToken = jwt.sign({ id: id }, `${process.env.JWT_TOKEN}`, {
    expiresIn: `${accessTokenTime}ms`,
  });
  const refToken = jwt.sign({ id: id }, `${process.env.JWT_REFRESH_TOKEN}`, {
    expiresIn: `${refTokenTime}ms`,
  });
  return { accessToken, refToken };
};

const createUser = async (req, res) => {
  const { user_password, user_email_id, user_name } =
    req.body;
  let password = user_password.toString();
  let hashPassword = await bcrypt.hash(password, 10);

  _checkUserExists(req.body.user_name).then((result) => {
    if (result.length >= 1) {
      return res.json({
        Registered: "name Already Registered",
        created: false,
      });
    }
    let obj = {
      user_name: user_name,
      user_email_id: user_email_id,
      user_password: hashPassword,
    };

    _createUser(obj)
      .then((data) => {
        const token = createToken(data[0].id);

        return res
          .status(201)
          .json({ user: data[0].id, token: token, created: true });
      })
      .catch((err) => {
        res.status(404).json({ msg: "not found" });
      });
  });
};

const userLogin = async (req, res) => {
  const { user_name, user_password } = req.body;
  _userLogin(user_name)
    .then((data) => {
      if (data.length === 0) {
        return res.json({ notExists: "Invalid User Name", status: false });
      }
      if ((user_password, data[0])) {
        if (bcrypt.compareSync(user_password, data[0].user_password)) {
          const token = createToken(data[0].id);

          _updateSessionID(data[0].id, token.accessToken)
            .then((data) => console.log())
            .catch((err) => console.log());

          return res
            .status(201)
            .cookie("token", token.refToken, {
              withCredentials: true,
              httpOnly: true,
            })
            .send({ status: true, user: data[0] });
        } else {
          return res.json({ notExists: "Invalid Password", status: false });
        }
      }
    })
    .catch((err) => {
      res.json({err : err.message, status: false });
    });
};

const getToken = (req, res) => {
  _token(req.body.id)
    .then((data) => {
      res.status(201).json({ status: true, user: data });
    })
    .catch((err) => {
      res.status(403).json({ status: false, error: err });
    });
};

const removeToken = (req, res) => {
  const { id, data } = req.body;
  _removeToken(id, data)
    .then((data) => {
      return res.status(201).json({ status: true, remove: "removed",user : data });
    })
    .catch((error) => {
      return res.status(201).json({ status: false, remove: "not removed", error : error.message });
    });
};

module.exports = { createUser, userLogin, getToken, createToken, removeToken };
