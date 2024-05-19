const dataSchema = require("../schema/test.schema");

exports.saveData = async (req, res) => {
  try {
    const data = req.body;
    // console.log(req.body);
    if (data) {
      const newData = new dataSchema(data);
      await newData.save();
      // await dataSchema.create(data);
      console.log(data);
      res.status(200).json({ data });
    }
  } catch (e) {
    res.status(500).send("ERROR 500:" + e.message);
  }
};

exports.getData = async (req, res) => {
  try {
    const allData = await dataSchema.find();
    return res.status(200).json({ data: allData });
  } catch (e) {
    // Handle errors
    res.status(500).send("ERROR 500:" + e.message);
  }
};
