const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var collectionName = "lich_chieu_theo_phim";
const Schema = mongoose.Schema;

const lichChieuTheoPhimSchema = new Schema({
  maLichChieu: Number,
  maRap: String,
  tenRap: String,
  ngayChieuGioChieu: String,
  giaVe: Number,
  thoiLuong: Number,
});

// Schema for DanhSachPhim
const danhSachPhimSchema = new Schema({
  lstLichChieuTheoPhim: [lichChieuTheoPhimSchema],
  maPhim: Number,
  tenPhim: String,
  hinhAnh: String,
  hot: Boolean,
  dangChieu: Boolean,
  sapChieu: Boolean,
});

// Schema for CumRap
const cumRapSchema = new Schema({
  danhSachPhim: [danhSachPhimSchema],
  maCumRap: String,
  tenCumRap: String,
  hinhAnh: String,
  diaChi: String,
});

// Main schema for the collection
const dataSchema = new Schema({
  cumRapChieu: [cumRapSchema],
  maHeThongRap: String,
  tenHeThongRap: String,
  logo: String,
});

module.exports = mongoose.model(
  "lich_chieu_theo_phim",
  dataSchema,
  collectionName
);
