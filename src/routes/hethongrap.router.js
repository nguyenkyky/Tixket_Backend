const express = require("express");
const router = express.Router();
const heThongRapController = require("../controller/hethongrap.controller");
var verifyAdmin = require("../middlewares/Admin.middleware");
var verifyToken = require("../middlewares/user.middleware");

router.get("/chitiethethongrap", heThongRapController.getHeThongRapTheoTen);
router.put("/update/hethongrap", heThongRapController.editHeThongRap);
router.get("/chitietcumrap", heThongRapController.getCumRapTheoTen);
router.put("/update/cumrap", heThongRapController.editCumRap);
router.post("/newhethongrap", heThongRapController.addHeThongRap);
router.post("/newcumrap",  heThongRapController.addCumRap);
router.delete("/deletecumrap", heThongRapController.deleteCumRap);
router.delete("/deletehethongrap", heThongRapController.deleteHeThongRap);
router.get("/cumraptheokhuvuc", heThongRapController.cumRapTheoKhuVuc);
module.exports = router;
