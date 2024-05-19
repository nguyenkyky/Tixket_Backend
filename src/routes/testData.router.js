var express = require("express");
var router = express.Router();
var testData = require("../controller/testData.controller");

router.post("/post", testData.saveData);
router.get("/getAll", testData.getData);

module.exports = router;
