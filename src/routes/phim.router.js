var Phim = require("../controller/phim.controller");
var express = require("express");
var router = express.Router();

router.post("/addnew", Phim.savePhim);
router.get("/get", Phim.timKiemPhim);
router.get("/all", Phim.getData);
router.put("/update", Phim.capNhatPhim);
router.delete("/delete", Phim.xoaPhim);
router.get("/find", Phim.find);

module.exports = router;
