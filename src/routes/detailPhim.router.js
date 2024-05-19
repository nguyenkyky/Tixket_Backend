const express = require("express");
const router = express.Router();
const detailPhimController = require("../controller/detailPhim.controller");

router.post("/post", detailPhimController.saveDetailPhim);
router.get("/get", detailPhimController.getFilmDetail);

module.exports = router;
