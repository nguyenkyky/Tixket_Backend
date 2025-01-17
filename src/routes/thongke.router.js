var ThongKe = require("../controller/thongke.controller");
var express = require("express");
var router = express.Router();

router.get("/laydulieuthongkemoi", ThongKe.layDuLieuThongKeMoi);
router.get("/thongketheothang", ThongKe.thongKeTheoThang);
router.get("/thongkethangtruoc", ThongKe.thongKeThangTruoc);
router.get("/thongke7ngay", ThongKe.layThongKe7Ngay);

module.exports = router;
