var Phongve = require("../controller/phongve.controller");
var verifyToken = require("../middlewares/user.middleware");
var express = require("express");
var router = express.Router();

router.get("/get", Phongve.getData);
router.post("/datVe", verifyToken, Phongve.datVe);
router.post("/kiemTraDatVe", Phongve.kiemTraDatVe);
router.get("/orderid", Phongve.orderId);

module.exports = router;
