const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var collectionName = "banner";
const Schema = mongoose.Schema;
var dataSchema = new Schema({
  maBanner: {
    type: Number,
  },
  maPhim: {
    type: Number,
  },
  hinhAnh: {
    type: String,
  },
});

module.exports = mongoose.model("banner", dataSchema, collectionName);
