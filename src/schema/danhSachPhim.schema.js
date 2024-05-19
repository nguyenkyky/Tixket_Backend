const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var collectionName = "lich_chieu_theo_phim";
const Schema = mongoose.Schema;

const lichChieuTheoPhimSchema = new Schema({
  maLichChieu: Number,
  maRap: String,
  tenRap: String,
  ngayChieuGioChieu: Date,
  giaVe: Number,
});

// Schema for DanhSachPhim
const dataSchema = new Schema({
  lstLichChieuTheoPhim: [lichChieuTheoPhimSchema],
  maPhim: Number,
  tenPhim: String,
  hinhAnh: String,
  hot: Boolean,
  dangChieu: Boolean,
  sapChieu: Boolean,
});

module.exports = mongoose.model(
  "lich_chieu_theo_phim",
  dataSchema,
  collectionName
);
