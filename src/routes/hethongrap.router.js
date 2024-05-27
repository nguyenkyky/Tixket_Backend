const express = require("express");
const router = express.Router();
const heThongRapController = require("../controller/hethongrap.controller");

router.get("/chitiethethongrap", heThongRapController.getHeThongRapTheoTen);
router.put("/update/hethongrap", heThongRapController.editHeThongRap);
router.get("/chitietcumrap", heThongRapController.getCumRapTheoTen);
router.put("/update/cumrap", heThongRapController.editCumRap);
router.post("/newhethongrap", heThongRapController.addHeThongRap);
router.post("/newcumrap", heThongRapController.addCumRap);
router.delete("/deletecumrap", heThongRapController.deleteCumRap);
router.delete("/deletehethongrap", heThongRapController.deleteHeThongRap);
module.exports = router;
