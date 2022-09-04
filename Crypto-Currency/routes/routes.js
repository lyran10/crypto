const router = require("express").Router();
const {
  createUser,
  userLogin,
  getToken,
  removeToken,
} = require("../controllers/users.js");
const { checkUser, refToken } = require("../middlewares/authMiddleWare.js");

// watch List functions
const {
  addToWatchList,
  checkInList,
  getList,
  deleteCoin,
} = require("../controllers/watchList.js");

router.post("/signup", createUser);

router.post("/login", userLogin);

router.post("/token", getToken);

router.get("/expires", checkUser);

router.get("/reftoken", refToken);

router.delete("/deltoken", removeToken);

router.get("/logout", (req, res) => {
  return res.status(200).clearCookie("token").json({ status: "cleared" });
});

// watch list routers
router.post("/addcoin",addToWatchList);

router.post("/getcoin", checkInList);

router.post("/getlist", getList);

router.delete("/deletecoin", deleteCoin);

module.exports = router;
