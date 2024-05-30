var TinTuc = require("../controller/tintuc.controller");
var express = require("express");
var router = express.Router();

router.get("/getData", TinTuc.getData);
router.get("/getAll", TinTuc.getAll);
router.post("/addnews", TinTuc.addNews);
router.delete("/delete", TinTuc.delete);
router.post("/editnews", TinTuc.editNews);
module.exports = router;
