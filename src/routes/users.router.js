var User = require("../controller/users.controller");
var express = require("express");
var router = express.Router();
var verifyToken = require("../middlewares/user.middleware");
router.post("/dangNhap", User.login);
router.post("/dangKy", User.register);

router.get("/thongTinDatVe", verifyToken, User.thongTinDatVe);
router.get("/all", User.danhSachNguoiDung);
router.get("/find", User.find);
router.delete("/delete", User.delete);
router.post("/update", User.update);
router.post("/doiMatKhau", User.changePassword);
router.post("/setvip", User.setVip);
router.get("/recoverPassword", User.recoverPassword);
router.post("/resetPassword", User.resetPassword);
router.post("/kiemTraDangNhap", verifyToken, User.kiemTraDangNhap);

module.exports = router;
