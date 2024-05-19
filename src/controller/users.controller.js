const jwt = require("jsonwebtoken");
const User = require("../schema/users.schema");

exports.login = async (req, res) => {
  const { taiKhoan, matKhau } = req.body;

  try {
    const user = await User.findOne({ taiKhoan });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.matKhau !== matKhau) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: "3h",
    });

    res.json({
      taiKhoan: user.taiKhoan,
      hoTen: user.hoTen,
      email: user.email,
      soDT: user.soDT,
      avatar: user.avatar,
      maNhom: user.maNhom,
      maLoaiNguoiDung: user.maLoaiNguoiDung,
      accessToken: token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.thongTinDatVe = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId); // Tìm người dùng dựa trên userId
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }

    res.json({
      taiKhoan: user.taiKhoan,
      hoTen: user.hoTen,
      email: user.email,
      soDT: user.soDT,
      maNhom: user.maNhom,
      maLoaiNguoiDung: user.maLoaiNguoiDung,
      thongTinDatVe: user.thongTinDatVe,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
