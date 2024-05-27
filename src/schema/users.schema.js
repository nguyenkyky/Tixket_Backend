const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;
var collectionName = "users";

const GheSchema = new Schema({
  maHeThongRap: String,
  tenHeThongRap: String,
  maCumRap: String,
  tenCumRap: String,
  maRap: String,
  tenRap: String,
  maGhe: [],
  tenGhe: [],
});

const ThongTinDatVeSchema = new Schema({
  danhSachGhe: [GheSchema],
  maVe: Number,
  ngayDat: Date,
  ngayChieu: String,
  gioChieu: String,
  tenPhim: String,
  giaVe: String,
  thoiLuongPhim: Number,
  diaChi: String,
  hinhAnh: String,
});

const dataSchema = new Schema({
  taiKhoan: {
    type: String,
    required: true,
    unique: true,
  },
  matKhau: {
    type: String,
    required: true,
  },
  hoTen: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  soDT: {
    type: String,
  },

  maLoaiNguoiDung: {
    type: String,
  },
  thongTinDatVe: [ThongTinDatVeSchema],
});

module.exports = mongoose.model("users", dataSchema, collectionName);
