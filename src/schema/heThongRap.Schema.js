const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var collectionName = "heThongRap";
const Schema = mongoose.Schema;

// Schema for CumRap
const cumRapSchema = new Schema({
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

module.exports = mongoose.model("heThongRap", dataSchema, collectionName);
