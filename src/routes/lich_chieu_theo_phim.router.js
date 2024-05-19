var LichChieu = require("../controller/lich_chieu_theo_phim.controller");

var express = require("express");
const lichChieuTheoPhimSchema = require("../schema/lichChieuTheoPhim.schema");
var router = express.Router();

router.post("/post", LichChieu.saveLichChieuTheoPhim);
router.get("/all", LichChieu.getData);
router.get("/allhethongrap", LichChieu.getAllHeThongRap);
router.get("/cumrap", LichChieu.getCumRap);
module.exports = router;
