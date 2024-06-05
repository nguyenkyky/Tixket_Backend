const express = require("express");
const router = express.Router();
const detailPhimController = require("../controller/detailPhim.controller");
var verifyToken = require("../middlewares/user.middleware");

router.post("/post", detailPhimController.saveDetailPhim);
router.get("/get", detailPhimController.getFilmDetail);
router.post("/rating", verifyToken, detailPhimController.rating);

module.exports = router;
