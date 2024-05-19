var Banner = require("../controller/banner.controller");
var express = require("express");
var router = express.Router();

router.post("/post", Banner.saveBanner);
router.get("/all", Banner.getData);

module.exports = router;
