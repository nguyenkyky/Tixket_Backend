require("dotenv").config();
var express = require("express");
var log = require("morgan")("dev");
var bodyParser = require("body-parser");
var cors = require("cors");
var properties = require("../config/properties");
var db = require("../config/database");
var apiRoutes = require("./routes/topPages");
var app = express();
var bodyParserJSON = bodyParser.json();
var bodyParserURLEncoded = bodyParser.urlencoded({ extended: true });
var router = express.Router();
const test = require("./routes/topPages");
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
  origin: "*",
  // methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  // preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
};
app.use(cors());

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
app.use("/api", test);
app.use("/test", testData);
app.use("/banner", banner);
app.use("/api/phim", phim);
app.use("/api/lichchieuphim", lichChieuTheoPhim);
app.use("/api/details", detailPhim);
app.use("/api/quanLyNguoiDung", user);
app.use("/api/phongve", phongve);
app.use("/api/hethongrap", heThongRap);
app.use("/api/news", news);
