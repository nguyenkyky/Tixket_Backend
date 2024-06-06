const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;
var collectionName = "phongve";

const ThongTinPhimSchema = new Schema({
  maLichChieu: Number,
  tenHeThongRap: String,
  tenCumRap: String,
  tenRap: String,
  diaChi: String,
  tenPhim: String,
  hinhAnh: String,
  ngayChieu: String,
  gioChieu: String,
  map: String,
});

const GheSchema = new Schema({
  maGhe: Number,
  tenGhe: String,
  maRap: Number,
  loaiGhe: String,
  stt: String,
  giaVe: Number,
  daDat: Boolean,
  taiKhoanNguoiDat: String,
});

const dataSchema = new Schema({
  thongTinPhim: ThongTinPhimSchema,
  danhSachGhe: [GheSchema],
});

module.exports = mongoose.model("phongve", dataSchema, collectionName);
