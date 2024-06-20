const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;
var collectionName = "users";

const GheSchema = new Schema({
  maGhe: [],
  tenGhe: [],
});

const ThongTinDatVeSchema = new Schema({
  orderId: Number,
  danhSachGhe: [GheSchema],

  tenHeThongRap: String,

  tenCumRap: String,
  map: String,
  ngayDat: Date,
  ngayChieu: String,
  gioChieu: String,
  tenPhim: String,
  giaVe: Number,
  khuyenMai: Number,
  tongTien: Number,
  thoiLuongPhim: Number,
  diaChi: String,
  hinhAnh: String,
});

const dataSchema = new Schema({
  uid: {
    type: "String",
  },
  taiKhoan: {
    type: String,
    required: true,
    unique: true,
  },
  matKhau: {
    type: String,
  },
  hoTen: {
    type: String,
    required: true,
  },
  email: {
    type: String,
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
  tongChiTieu: {
    type: Number,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: String,
  },
  thongTinDatVe: [ThongTinDatVeSchema],
});

module.exports = mongoose.model("users", dataSchema, collectionName);
