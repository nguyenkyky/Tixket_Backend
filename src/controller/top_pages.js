const dataSchema = require("../schema/test.schema");

exports.index = async (req, res) => {
  try {
    res.json({ message: "Connected" });
  } catch (e) {
    res.status(500).send("ERROR 500:" + e.message);
  }
};
