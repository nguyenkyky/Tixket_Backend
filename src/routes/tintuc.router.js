var TinTuc = require("../controller/tintuc.controller");
var express = require("express");
var router = express.Router();

router.get("/getData", TinTuc.getData);
router.get("/getAll", TinTuc.getAll);

module.exports = router;
