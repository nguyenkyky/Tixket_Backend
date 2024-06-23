const jwt = require("jsonwebtoken");
const User = require("../schema/users.schema");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");
const admin = require("../util/firebase/firebaseAdmin");
const jwtSign = require("../util/jwt/jwt");
var properties = require("../../config/properties");

const GOOGLE_MAILER_CLIENT_ID =
  process.env.GOOGLE_MAILER_CLIENT_ID || properties.GOOGLE_MAILER_CLIENT_ID;
const GOOGLE_MAILER_CLIENT_SECRET =
  process.env.GOOGLE_MAILER_CLIENT_SECRET ||
  properties.GOOGLE_MAILER_CLIENT_SECRET;
const GOOGLE_MAILER_REFRESH_TOKEN =
  process.env.GOOGLE_MAILER_REFRESH_TOKEN ||
  properties.GOOGLE_MAILER_REFRESH_TOKEN;
const ADMIN_EMAIL_ADDRESS =
  process.env.ADMIN_EMAIL_ADDRESS || properties.ADMIN_EMAIL_ADDRESS;

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

    const token = jwtSign(user);

    res.json({
      taiKhoan: user.taiKhoan,
      hoTen: user.hoTen,
      email: user.email,
      soDT: user.soDT,
      avatar: user.avatar,
      maLoaiNguoiDung: user.maLoaiNguoiDung,
      tongChiTieu: user.tongChiTieu,
      accessToken: token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.firebaseLogin = async (req, res) => {
  const { token } = req.body;
  try {
    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);

    const { uid, email, name, picture } = decodedToken;

    let user = await User.findOne({ uid });

    if (!user) {
      user = new User({
        uid,
        taiKhoan: email,
        hoTen: name,
        email,
        avatar: picture,
        maLoaiNguoiDung: "KhachHang",
        tongChiTieu: 0,
      });
      await user.save();
    }

    res.json({ user, accessToken: token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

exports.register = async (req, res) => {
  const { username, hoTen, matKhau, xacNhanMatKhau } = req.body;

  try {
    // Kiểm tra xem username đã tồn tại chưa
    const existingUser = await User.findOne({ taiKhoan: username });
    if (existingUser) {
      return res.status(402).json({ message: "Username already exists" });
    }

    // Kiểm tra xem mật khẩu có khớp với xác nhận mật khẩu không
    if (matKhau !== xacNhanMatKhau) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Tạo mới user với thông tin mặc định
    const newUser = new User({
      taiKhoan: username,
      uid: username,
      hoTen: hoTen,
      matKhau: matKhau,
      email: "",
      soDT: "",
      avatar:
        "https://cdn-media.sforum.vn/storage/app/media/wp-content/uploads/2024/02/avatar-anh-meo-cute-1.jpg",
      maLoaiNguoiDung: "KhachHang",
      tongChiTieu: 0,
    });

    // Lưu user mới vào cơ sở dữ liệu
    const savedUser = await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully", user: savedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.danhSachNguoiDung = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.thongTinDatVe = async (req, res) => {
  const userId = req.user.uid;

  try {
    const user = await User.findOne({ uid: userId }); // Tìm người dùng dựa trên userId
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }

    res.json({
      taiKhoan: user.taiKhoan,
      hoTen: user.hoTen,
      email: user.email,
      soDT: user.soDT,
      maLoaiNguoiDung: user.maLoaiNguoiDung,
      tongChiTieu: user.tongChiTieu,
      thongTinDatVe: user.thongTinDatVe,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.find = async (req, res) => {
  try {
    const { taiKhoan } = req.query; // Lấy dữ liệu từ body

    // Tìm kiếm người dùng theo tên
    const userFind = await User.find({
      $or: [
        { taiKhoan: { $regex: taiKhoan, $options: "i" } }, // Tìm kiếm không phân biệt hoa thường trong tên phim
      ],
    });

    if (!userFind.length) {
      return res.status(404).send("Không tìm thấy người dùng nào.");
    }

    res.status(200).json({ message: "Tìm kiếm thành công", user: userFind });
  } catch (e) {
    res.status(500).send("ERROR 500:" + e.message);
  }
};

exports.update = async (req, res) => {
  const { hoTen, email, soDT, avatar, taiKhoan, newTaiKhoan, newEmail } =
    req.body;

  try {
    // Find the user
    const user = await User.findOne({ taiKhoan });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if newTaiKhoan already exists, but ignore if it's the same as the current taiKhoan
    if (newTaiKhoan !== taiKhoan) {
      const existingUser = await User.findOne({ taiKhoan: newTaiKhoan });
      if (existingUser) {
        return res.status(400).json({ message: "Username đã được sử dụng" });
      }
    }

    if (
      newEmail.length === 0 ||
      newTaiKhoan.length === 0 ||
      hoTen.length === 0 ||
      soDT.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Vui lòng điền đầy đủ thông tin" });
    }

    if (newEmail !== email) {
      const existingUser = await User.findOne({ email: newEmail });
      if (existingUser) {
        return res.status(400).json({ message: "Email đã được sử dụng" });
      }
    }

    // Update the user
    user.hoTen = hoTen;
    user.email = newEmail;
    user.soDT = soDT;
    user.avatar = avatar;
    user.taiKhoan = newTaiKhoan;

    // Save the updated user
    const updatedUser = await user.save();

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.delete = async (req, res) => {
  try {
    const { taiKhoan } = req.query; // Lấy dữ liệu từ body

    // Xóa người dùng theo tên
    const userDelete = await User.deleteOne({ taiKhoan });

    if (!userDelete) {
      return res.status(404).send("Không tìm thấy người dùng nào.");
    }

    res.status(200).json({ message: "Xóa thành công", user: userDelete });
  } catch (e) {
    res.status(500).send("ERROR 500:" + e.message);
  }
};

exports.changePassword = async (req, res) => {
  const { taiKhoan, currentPassword, newPassword } = req.body;

  try {
    // Tìm người dùng dựa trên tài khoản
    const user = await User.findOne({ taiKhoan });

    // Kiểm tra xem người dùng có tồn tại hay không
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra xem mật khẩu hiện tại có đúng hay không
    if (user.matKhau !== currentPassword) {
      return res.status(400).json({ message: "Invalid current password" });
    }

    // Cập nhật mật khẩu mới
    user.matKhau = newPassword;

    // Lưu thay đổi
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.setVip = async (req, res) => {
  const { taiKhoanSetVip } = req.body;

  try {
    // Tìm người dùng dựa trên tài khoản
    const user = await User.findOne({ taiKhoan: taiKhoanSetVip });

    // Kiểm tra xem người dùng có tồn tại hay không
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Cập nhật loại người dùng thành Vip
    user.maLoaiNguoiDung = "Vip";

    // Lưu thay đổi
    await user.save();

    res.status(200).json({ message: "User set to Vip successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.recoverPassword = async (req, res) => {
  try {
    const myOAuth2Client = new OAuth2Client(
      GOOGLE_MAILER_CLIENT_ID,
      GOOGLE_MAILER_CLIENT_SECRET
    );
    // Set Refresh Token vào OAuth2Client Credentials
    myOAuth2Client.setCredentials({
      refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
    });

    const myAccessTokenObject = await myOAuth2Client.getAccessToken();
    // console.log(myAccessTokenObject);

    const myAccessToken = myAccessTokenObject?.token;
    // console.log("Đến đây vẫn được");

    const { taiKhoan } = req.query;
    // console.log(taiKhoan);

    const user = await User.findOne({ taiKhoan });
    console.log(user);
    if (!user) {
      return res.status(404).send("User không tồn tại");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hash;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour

    await user.save();

    const resetUrl = `${process.env.DOMAIN}/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: ADMIN_EMAIL_ADDRESS,
        clientId: GOOGLE_MAILER_CLIENT_ID,
        clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
        refreshToken: GOOGLE_MAILER_REFRESH_TOKEN,
        accessToken: myAccessToken,
      },
    });

    const mailOptions = {
      to: user.email,
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      ${resetUrl}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send("Email đã được gửi để đặt lại mật khẩu");
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, matKhau } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send("Token không hợp lệ hoặc đã hết hạn");
    }

    user.matKhau = matKhau;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).send("Mật khẩu đã được đặt lại thành công");
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.kiemTraDangNhap = async (req, res) => {
  try {
    res.status(200).json({ message: "Token hợp lệ" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.kiemTraAdmin = async (req, res) => {
  try {
    res.status(200).json({ message: "Token hợp lệ" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
