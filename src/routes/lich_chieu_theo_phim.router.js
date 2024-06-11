var LichChieu = require("../controller/lich_chieu_theo_phim.controller");
var verifyAdmin = require("../middlewares/Admin.middleware");
var express = require("express");

var router = express.Router();

router.post("/post", verifyAdmin, LichChieu.saveLichChieuTheoPhim);
router.get("/all", LichChieu.getData);
router.get("/allhethongrap", LichChieu.getAllHeThongRap);
router.get("/cumrap", LichChieu.getCumRap);
router.get("/lichchieu", LichChieu.getLichChieuTheoCumRap);
router.get("/allshowtimes", LichChieu.getAllShowtimes);
router.delete("/delete", verifyAdmin, LichChieu.xoaLichChieuPhim);
router.get("/lichchieutheorap", LichChieu.getLichChieuTheoCumRap2);
module.exports = router;
