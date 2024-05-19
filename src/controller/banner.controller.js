var bannerSchema = require("../schema/banner.schema");
const dataSchema = require("../schema/test.schema");

exports.getData = async (req, res) => {
  try {
    const allData = await bannerSchema.find();
    return res.status(200).json({ data: allData });
  } catch (e) {
    // Handle errors
    res.status(500).send("ERROR 500:" + e.message);
  }
};

exports.saveBanner = async (req, res) => {
  try {
    const banner = req.body;
    // console.log(req.body);
    if (banner) {
      const newBanner = new bannerSchema(banner);
      await newBanner.save();
      // await dataSchema.create(data);
      // console.log(banner);
      res.status(200).json({ banner });
    }
  } catch (e) {
    res.status(500).send("ERROR 500:" + e.message);
  }
};
