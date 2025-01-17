const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var collectionName = "detail_phim";
const Schema = mongoose.Schema;

const lichChieuPhimSchema = new Schema({
  maLichChieu: Number,
  ngayChieuGioChieu: String,
  giaVe: Number,
  thoiLuong: Number,
});

const cumRapChieuSchema = new Schema({
  lichChieuPhim: [lichChieuPhimSchema],
  maCumRap: String,
  tenCumRap: String,
  hinhAnh: String,
  diaChi: String,
  khuVuc: String,
  hotline: String,
  map: String,
  banner: Array,
});

const heThongRapChieuSchema = new Schema({
  cumRapChieu: [cumRapChieuSchema],
  maHeThongRap: String,
  tenHeThongRap: String,
  logo: String,
});

const ratingSchema = new Schema({
  taiKhoan: String,
  rate: Number,
});

const dataSchema = new Schema({
  heThongRapChieu: [heThongRapChieuSchema],
  maPhim: Number,
  tenPhim: String,
  biDanh: String,
  dienVien: Array,
  daoDien: String,
  thoiLuong: Number,
  theLoai: Array,
  quocGia: String,
  trailer: String,
  hinhAnh: String,
  poster: String,
  moTa: String,
  maNhom: String,
  hot: Boolean,
  dangChieu: Boolean,
  sapChieu: Boolean,
  ngayKhoiChieu: Date,
  danhGia: Number,
  rating: [ratingSchema],
});

module.exports = mongoose.model("detail_phim", dataSchema, collectionName);
