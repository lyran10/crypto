let db = require("../connections/connections.js");

const _checkUserExists = (user) => {
  return db("users").where({ user_name: user }).returning("*");
};

const _checkToken = (id) => {
  return db("users").where({ id: id }).returning("*");
};

const _createUser = (obj) => {
  return db("users").insert(obj).returning("*");
};

const _userLogin = (user) => {
  return db("users").where({ user_name: user }).returning("*");
};

const _updateSessionID = (id, data) => {
  return db("users")
    .update("session_id", data)
    .where({ id: id })
    .returning("*");
};

const _token = (id) => {
  return db("users").where({ id: id }).returning("*");
};

const _removeToken = (id, data) => {
  return db("users")
    .update("session_id", data)
    .where({ id: id })
    .returning("*");
};

module.exports = {
  _checkUserExists,
  _createUser,
  _userLogin,
  _checkToken,
  _updateSessionID,
  _token,
  _removeToken,
};
