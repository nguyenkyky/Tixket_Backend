var User = require("../controller/users.controller");
var express = require("express");
var router = express.Router();
var verifyToken = require("../middlewares/user.middleware");
router.post("/dangNhap", User.login);
router.get("/thongTinDatVe", verifyToken, User.thongTinDatVe);

module.exports = router;
