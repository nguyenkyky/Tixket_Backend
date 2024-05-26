const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;
var collectionName = "news";

var dataSchema = new Schema({
  maTinTuc: {
    type: Number,
  },
  render: {
    type: String,
  },
});

module.exports = mongoose.model("news", dataSchema, collectionName);
