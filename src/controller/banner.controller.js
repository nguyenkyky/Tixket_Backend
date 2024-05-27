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
    const banners = req.body;

    // Xóa toàn bộ dữ liệu hiện có trong bannerSchema
    await bannerSchema.deleteMany({});

    // Thêm dữ liệu mới từ mảng banners
    await bannerSchema.insertMany(banners);

    return res
      .status(201)
      .json({ message: "Cập nhật dữ liệu thành công", data: banners });
  } catch (e) {
    // Handle errors
    res.status(500).send("ERROR 500:" + e.message);
  }
};
