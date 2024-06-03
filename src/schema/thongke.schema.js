const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;
var collectionName = "thongke";

// Schema for phimDetails in cumRapDetails
const phimDetailsSchema = new Schema({
  tenPhim: String,
  maPhim: Number,
  totalTickets: Number,
  totalAmount: Number,
});

// Schema for cumRapDetails in heThongRap
const cumRapDetailsSchema = new Schema({
  tenCumRap: String,
  maCumRap: String,
  totalTickets: Number,
  totalAmount: Number,
  phimDetails: [phimDetailsSchema],
});

// Schema for heThongRap in detailedReport
const heThongRapSchema = new Schema({
  tenHeThongRap: String,
  maHeThongRap: String,
  totalTickets: Number,
  totalAmount: Number,
  cumRapDetails: [cumRapDetailsSchema],
});

// Main schema for the detailed report
const dataSchema = new Schema({
  year: {
    type: Number,
  },
  month: {
    type: Number,
  },
  totalAmount: {
    type: Number,
  },
  totalTickets: {
    type: Number,
  },
  detailedReport: [heThongRapSchema],
});

module.exports = mongoose.model("thongke", dataSchema, collectionName);
