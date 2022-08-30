let db = require("../connections/connections.js");

const _addToWatchList = (obj) => {
  return db("watch_list").insert(obj).returning("*");
};

const _checkInList = (id) => {
  return db("watch_list").where({ coin: id }).returning("*");
};

const _getList = (id) => {
  return db("watch_list").where({ user_id: id }).returning("*");
};

const _deleteCoin = (id) => {
  return db("watch_list").del().where({ coin: id }).returning("*");
};

module.exports = { _addToWatchList, _checkInList, _getList, _deleteCoin };
