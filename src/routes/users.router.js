var User = require("../controller/users.controller");
var express = require("express");
var router = express.Router();
var verifyToken = require("../middlewares/user.middleware");
var verifyAdmin = require("../middlewares/Admin.middleware");
router.post("/dangNhap", User.login);
router.post("/dangKy", User.register);

router.get("/thongTinDatVe", verifyToken, User.thongTinDatVe);
router.get("/all", verifyAdmin, User.danhSachNguoiDung);
router.get("/find", verifyAdmin, User.find);
router.delete("/delete", verifyAdmin, User.delete);
router.post("/update", verifyToken, User.update);
router.post("/doiMatKhau", verifyToken, User.changePassword);
router.post("/setvip", verifyToken, User.setVip);
router.get("/recoverPassword", User.recoverPassword);
router.post("/resetPassword", User.resetPassword);
router.post("/kiemTraDangNhap", verifyToken, User.kiemTraDangNhap);
router.post("/kiemTraAdmin", verifyAdmin, User.kiemTraAdmin);
router.post("/firebaseLogin", User.firebaseLogin);

module.exports = router;
