require("dotenv").config();
var express = require("express");
var log = require("morgan")("dev");
var bodyParser = require("body-parser");
var cors = require("cors");
var properties = require("../config/properties");
var db = require("../config/database");

var app = express();
var bodyParserJSON = bodyParser.json();
var bodyParserURLEncoded = bodyParser.urlencoded({ extended: true });
var router = express.Router();
var verifyToken = require("./middlewares/user.middleware");
const PayOS = require("@payos/node");
const payos = new PayOS(
  "be504d63-23c5-4b06-b62f-91dfc9bd6f2e",
  "4a94014e-dbee-4bac-a4f3-922943469e6e",
  "2ba7a7f1774eb07cc39761f1c9a8e8f06f41629b9efe422acb17e007262774ee"
);
app.use(express.static("public"));
app.use(express.json());
const DOMAIN = "http://localhost:3000";

const testData = require("./routes/testData.router");
// const book = require("./routes/book.router");
const banner = require("./routes/banner.router");
const phim = require("./routes/phim.router");
const lichChieuTheoPhim = require("./routes/lich_chieu_theo_phim.router");
const detailPhim = require("./routes/detailPhim.router");
const user = require("./routes/users.router");
const phongve = require("./routes/phongve.router");
const heThongRap = require("./routes/hethongrap.router");
const news = require("./routes/tintuc.router");

// var whitelist = properties.CORS;
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
// };

// app.use(cors(corsOptions));

const corsOptions = {
  origin: ["http://localhost:3000", "http://192.168.1.2:3000"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
};
app.use(cors(corsOptions));

db();
// app.use(log);
app.use(bodyParserJSON);
app.use(bodyParserURLEncoded);
// app.use("/api", router);
// apiRoutes(router);

app.listen(properties.PORT, (req, res) => {
  console.log(`Server is running on ${properties.PORT} port.`);
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// app.use("/", book);

app.use("/test", testData);
app.use("/banner", banner);
app.use("/api/phim", phim);
app.use("/api/lichchieuphim", lichChieuTheoPhim);
app.use("/api/details", detailPhim);
app.use("/api/quanLyNguoiDung", user);
app.use("/api/phongve", phongve);
app.use("/api/hethongrap", heThongRap);
app.use("/api/news", news);

app.post("/create-payment-link", async (req, res) => {
  try {
    const { tongTien, orderId, id } = req.body;
    const order = {
      amount: tongTien,
      description: "Thanh toan hoa don",
      orderCode: orderId,
      returnUrl: `${DOMAIN}/checkout/${id}?payment=success`,
      cancelUrl: `${DOMAIN}/home`,
    };
    const paymentLink = await payos.createPaymentLink(order);
    res.json({ checkoutUrl: paymentLink.checkoutUrl });
  } catch (error) {
    res.status(500).send("Error creating payment link");
  }
});

app.post("/receive-hook", async (req, res) => {
  console.log(req.body);
  res.json();
});
