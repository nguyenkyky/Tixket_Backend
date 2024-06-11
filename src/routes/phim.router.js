var Phim = require("../controller/phim.controller");
var express = require("express");
var router = express.Router();
var verifyAdmin = require("../middlewares/Admin.middleware");

router.post("/addnew", verifyAdmin, Phim.savePhim);
router.get("/get", Phim.timKiemPhim);
router.get("/all", Phim.getData);
router.post("/update", verifyAdmin, Phim.capNhatPhim);
router.delete("/delete", verifyAdmin, Phim.xoaPhim);
router.get("/find", Phim.find);

module.exports = router;
