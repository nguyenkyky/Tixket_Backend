const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;
var collectionName = "news";

var dataSchema = new Schema({
  maTinTuc: {
    type: Number,
  },
  title: {
    type: String,
  },
  hinhAnh: {
    type: String,
  },
  render: {
    type: String,
  },
  created_at: {
    type: Date,
  },
});

module.exports = mongoose.model("news", dataSchema, collectionName);
