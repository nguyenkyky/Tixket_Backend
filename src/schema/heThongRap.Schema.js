const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const collectionName = "heThongRap";

// Schema cho CumRap
const cumRapSchema = new Schema({
  maCumRap: String,
  tenCumRap: String,
  hinhAnh: String,
  diaChi: String,
  khuVuc: String,
  hotline: String,
  map: String,
});

// Schema chính cho collection
const dataSchema = new Schema({
  cumRapChieu: [cumRapSchema],
  maHeThongRap: String,
  tenHeThongRap: String,
  logo: String,
});

// Kiểm tra nếu model đã tồn tại trước khi định nghĩa nó
module.exports =
  mongoose.models.heThongRap ||
  mongoose.model("heThongRap", dataSchema, collectionName);
