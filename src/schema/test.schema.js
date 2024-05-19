const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var collectionName = "test";
const Schema = mongoose.Schema;
var dataSchema = new Schema({
  content: {
    type: String,
  },
});

module.exports = mongoose.model("test", dataSchema, collectionName);
