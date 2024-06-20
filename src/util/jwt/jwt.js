const jwt = require("jsonwebtoken");

const jwtSign = (user) => {
  return jwt.sign(
    { uid: user.uid, role: user.maLoaiNguoiDung },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "3h",
    }
  );
};

module.exports = jwtSign;
