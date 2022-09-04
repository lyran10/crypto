const {
  _addToWatchList,
  _checkInList,
  _getList,
  _deleteCoin,
} = require("../modules/watchList.js");

const addToWatchList = (req, res) => {
  const {id,coin} = req.body
  _addToWatchList(id,coin)
    .then((data) => {
      res.json({ list: data });
    })
    .catch((err) => {
      res.json({ error: err });
    });
};

const checkInList = (req, res) => {
  const { id } = req.body;
  _checkInList(id)
    .then((data) => {
      if (data.length !== 0) {
        res.json({ status: true, data: data });
      } else {
        res.json({ status: false, data: data });
      }
    })
    .catch((error) => {
      res.json({ status: false, error: error });
    });
};

const getList = (req, res) => {
  _getList(req.body.user_id.id)
    .then((data) => {
      if (data.length !== 0) {
        res.json({ status: true, data: data });
      } else {
        res.json({ status: false, data: data });
      }
    })
    .catch((error) => {
      res.json({ status: false, error: error });
    });
};

const deleteCoin = (req, res) => {
  _deleteCoin(req.body.id)
    .then((data) => {
      res.json({ list: data });
    })
    .catch((err) => {
      res.json({ error: err });
    });
};

module.exports = { addToWatchList, checkInList, getList, deleteCoin };
