const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var collectionName = "lich_chieu_theo_phim";
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  orderId: Number,
  nguoiDat: String,
  soLuongGhe: Number,
  tongTien: Number,
  ngayDat: Date,
});

const lichChieuTheoPhimSchema = new Schema({
  maLichChieu: Number,

  ngayChieuGioChieu: String,
  giaVe: Number,
  thoiLuong: Number,
  order: [orderSchema],
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
  thoiLuong: Number,
  theLoai: Array,
  dienVien: Array,
});

// Schema for CumRap
const cumRapSchema = new Schema({
  danhSachPhim: [danhSachPhimSchema],
  maCumRap: String,
  tenCumRap: String,
  hinhAnh: String,
  diaChi: String,
  khuVuc: String,
  hotline: String,
  map: String,
  banner: Array,
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
