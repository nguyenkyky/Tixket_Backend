var TinTuc = require("../controller/tintuc.controller");
var express = require("express");
var router = express.Router();
var verifyAdmin = require("../middlewares/Admin.middleware");

router.get("/getData", TinTuc.getData);
router.get("/getAll", TinTuc.getAll);
router.post("/addnews", verifyAdmin, TinTuc.addNews);
router.delete("/delete", verifyAdmin, TinTuc.delete);
router.post("/editnews", verifyAdmin, TinTuc.editNews);
module.exports = router;
