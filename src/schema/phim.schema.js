const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var collectionName = "phim";
const Schema = mongoose.Schema;
var dataSchema = new Schema({
  maPhim: {
    type: Number,
  },
  tenPhim: {
    type: String,
  },
  biDanh: {
    type: String,
  },
  trailer: {
    type: String,
  },
  daoDien: {
    type: String,
  },
  dienVien: {
    type: Array,
  },
  thoiLuong: {
    type: Number,
  },

  hinhAnh: {
    type: String,
  },
  moTa: {
    type: String,
  },
  maNhom: {
    type: String,
  },
  ngayKhoiChieu: {
    type: Date,
  },
  danhGia: {
    type: Number,
  },
  hot: {
    type: Boolean,
  },
  dangChieu: {
    type: Boolean,
  },
  sapChieu: {
    type: Boolean,
  },
});

module.exports = mongoose.model("phim", dataSchema, collectionName);
