var LichChieu = require("../controller/lich_chieu_theo_phim.controller");

var express = require("express");

var router = express.Router();

router.post("/post", LichChieu.saveLichChieuTheoPhim);
router.get("/all", LichChieu.getData);
router.get("/allhethongrap", LichChieu.getAllHeThongRap);
router.get("/cumrap", LichChieu.getCumRap);
router.get("/lichchieu", LichChieu.getLichChieuTheoCumRap);
router.delete("/delete", LichChieu.xoaLichChieuPhim);
module.exports = router;
