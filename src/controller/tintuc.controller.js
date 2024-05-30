var tinTucSchema = require("../schema/tintuc.schema");
var maPhimMaLichChieuSchema = require("../schema/maPhim_maLichChieu.schema");
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

exports.getAll = async (req, res) => {
  try {
    const data = await tinTucSchema.find().sort({ created_at: -1 });
    res.json(data);
  } catch (e) {
    res.status(500).send("ERROR 500:" + e.message);
  }
};

exports.addNews = async (req, res) => {
  try {
    let maTinTucRecord = await maPhimMaLichChieuSchema.findOne();

    if (!maTinTucRecord) {
      return res.status(404).send("maTinTuc record not found");
    }

    const newMaTinTuc = maTinTucRecord.maTinTuc + 1;

    await maPhimMaLichChieuSchema.updateOne({}, { maTinTuc: newMaTinTuc });
    const { title, hinhAnh, render } = req.body;
    const newNews = new tinTucSchema({
      maTinTuc: newMaTinTuc,
      title,
      hinhAnh,
      render,
      created_at: new Date(),
    });
    await newNews.save();
    res.json(newNews);
  } catch (e) {
    res.status(500).send("ERROR 500:" + e.message);
  }
};

exports.delete = async (req, res) => {
  const { maTinTuc } = req.query;
  try {
    const data = await tinTucSchema.findOneAndDelete({ maTinTuc: maTinTuc });
    if (!data) {
      return res.status(404).json({ message: "Data not found" });
    }
    res.json(data);
  } catch (e) {
    res.status(500).send("ERROR 500:" + e.message);
  }
};

exports.editNews = async (req, res) => {
  const { maTinTuc, title, hinhAnh, render } = req.body;

  try {
    const data = await tinTucSchema.findOne({ maTinTuc: maTinTuc });
    if (!data) {
      return res.status(404).json({ message: "Data not found" });
    }

    data.title = title;
    data.hinhAnh = hinhAnh;
    data.render = render;

    const updatedData = await data.save();
    res.json(updatedData);
  } catch (e) {
    res.status(500).send("ERROR 500:" + e.message);
  }
};
