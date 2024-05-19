const jwt = require("jsonwebtoken");

// Middleware xác thực JWT
const verifyToken = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1]; // Lấy token từ tiêu đề Authorization
  if (token == null) return res.sendStatus(401); // Nếu không có token, trả về 401 Unauthorized

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Nếu token không hợp lệ, trả về 403 Forbidden
    req.user = user; // Lưu thông tin người dùng vào req.user để sử dụng ở các handler tiếp theo
    next(); // Chuyển sang middleware/handler tiếp theo
  });
};

module.exports = verifyToken;
