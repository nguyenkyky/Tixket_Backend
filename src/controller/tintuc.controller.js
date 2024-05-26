var tinTucSchema = require("../schema/tintuc.schema");

exports.getData = async (req, res) => {
  try {
    const { id } = req.query;
    const data = await tinTucSchema.findOne({
      maTinTuc: id,
    });
    if (!data) {
      return res.status(404).json({ message: "Data not found" });
    }

    res.json(data);
  } catch (e) {
    // Handle errors
    res.status(500).send("ERROR 500:" + e.message);
  }
};
