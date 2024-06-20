const jwt = require("jsonwebtoken");

const admin = require("../util/firebase/firebaseAdmin");

// Middleware xác thực JWT
const verifyToken = async (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1]; // Lấy token từ tiêu đề Authorization
  if (token == null) return res.sendStatus(401); // Nếu không có token, trả về 401 Unauthorized

  // jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
  //   if (err) return res.sendStatus(403);
  //   req.user = user;
  //   next();
  // });

  try {
    // Kiểm tra JWT token
    const jwtUser = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = jwtUser;

    next();
  } catch (jwtError) {
    try {
      const firebaseUser = await admin.auth().verifyIdToken(token);
      req.user = firebaseUser;

      next();
    } catch (firebaseError) {
      return res.sendStatus(403);
    }
  }
};

module.exports = verifyToken;
