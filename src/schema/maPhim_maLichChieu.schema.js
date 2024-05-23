const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var collectionName = "maPhim_maLichChieu";
const Schema = mongoose.Schema;
var dataSchema = new Schema({
  maPhim: {
    type: Number,
  },
  maLichChieu: {
    type: Number,
  },
  maGhe: {
    type: Number,
  },
  maBanner: {
    type: Number,
  },
});

module.exports = mongoose.model(
  "maPhim_maLichChieu",
  dataSchema,
  collectionName
);
