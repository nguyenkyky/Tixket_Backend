var heThongRapSchema = require("../schema/heThongRap.Schema");
var lichChieuTheoPhimSchema = require("../schema/lichChieuTheoPhim.schema");
var detailPhimSchema = require("../schema/DetailPhim.schema");
exports.getHeThongRapTheoTen = async (req, res) => {
  try {
    const { maHeThongRap } = req.query;
    const heThongRap = await heThongRapSchema.findOne({ maHeThongRap });
    if (!heThongRap) {
      return res.status(404).send("He thong rap not found");
    }
    return res.status(200).json({ data: heThongRap });
  } catch (e) {
    res.status(500).send("ERROR 500:" + e.message);
  }
};

exports.getCumRapTheoTen = async (req, res) => {
  try {
    const { maHeThongRap, maCumRap } = req.query;

    // Tìm hệ thống rạp có maHeThongRap
    const heThongRap = await heThongRapSchema.findOne({ maHeThongRap });

    if (!heThongRap) {
      return res.status(404).send("He thong rap not found");
    }

    // Tìm cụm rạp trong mảng cumRapChieu
    const cumRap = heThongRap.cumRapChieu.find(
      (cumRap) => cumRap.maCumRap === maCumRap
    );

    if (!cumRap) {
      return res.status(404).send("Cum rap not found");
    }

    return res.status(200).json({ data: cumRap });
  } catch (e) {
    return res.status(500).send("ERROR 500:" + e.message);
  }
};

exports.editHeThongRap = async (req, res) => {
  try {
    const { tenHeThongRap, maHeThongRap, newMaHeThongRap, logo } = req.body;

    // Tìm và cập nhật thông tin trong heThongRapSchema
    const heThongRap = await heThongRapSchema.findOneAndUpdate(
      { maHeThongRap },
      {
        maHeThongRap: newMaHeThongRap,
        tenHeThongRap,
        logo,
      },
      { new: true }
    );

    if (!heThongRap) {
      return res.status(404).send("He thong rap not found");
    }

    // Tìm và cập nhật thông tin trong lichChieuTheoPhimSchema
    await lichChieuTheoPhimSchema.findOneAndUpdate(
      { maHeThongRap },
      {
        maHeThongRap: newMaHeThongRap,
        tenHeThongRap,
        logo,
      },
      { new: true }
    );

    // Tìm và cập nhật thông tin trong detailPhimSchema
    const films = await detailPhimSchema.find({
      "heThongRapChieu.maHeThongRap": maHeThongRap.toString(),
    });

    for (let film of films) {
      for (let heThongRap of film.heThongRapChieu) {
        if (heThongRap.maHeThongRap === maHeThongRap.toString()) {
          heThongRap.maHeThongRap = newMaHeThongRap.toString();
          heThongRap.tenHeThongRap = tenHeThongRap.toString();
          heThongRap.logo = logo.toString();
        }
      }
      await film.save();
    }

    return res
      .status(200)
      .json({ message: "Cập nhật thông tin thành công", data: heThongRap });
  } catch (e) {
    return res.status(500).send("ERROR 500:" + e.message);
  }
};

exports.editCumRap = async (req, res) => {
  try {
    const {
      maHeThongRap,
      maCumRap,
      newMaCumRap,
      tenCumRap,
      diaChi,
      hinhAnh,
      khuVuc,
      hotline,
      map,
      banner,
    } = req.body;

    // Tìm và cập nhật thông tin trong heThongRapSchema
    const heThongRap = await heThongRapSchema.findOne({ maHeThongRap });
    if (!heThongRap) {
      return res.status(404).send("He thong rap not found");
    }

    let cumRapIndex = heThongRap.cumRapChieu.findIndex(
      (cumRap) => cumRap.maCumRap === maCumRap
    );
    if (cumRapIndex === -1) {
      return res.status(404).send("Cum rap not found");
    }

    heThongRap.cumRapChieu[cumRapIndex] = {
      maCumRap: newMaCumRap,
      tenCumRap,
      diaChi,
      hinhAnh,
      khuVuc,
      hotline,
      map,
      banner,
    };

    await heThongRap.save();

    // Tìm và cập nhật thông tin trong lichChieuTheoPhimSchema
    await lichChieuTheoPhimSchema.updateMany(
      { maHeThongRap, "cumRapChieu.maCumRap": maCumRap.toString() },
      {
        $set: {
          "cumRapChieu.$.maCumRap": newMaCumRap,
          "cumRapChieu.$.tenCumRap": tenCumRap,
          "cumRapChieu.$.diaChi": diaChi,
          "cumRapChieu.$.hinhAnh": hinhAnh,
          "cumRapChieu.$.khuVuc": khuVuc,
          "cumRapChieu.$.hotline": hotline,
          "cumRapChieu.$.map": map,
          "cumRapChieu.$.banner": banner,
        },
      }
    );

    // Tìm và cập nhật thông tin trong detailPhimSchema
    const films = await detailPhimSchema.find({
      "heThongRapChieu.maHeThongRap": maHeThongRap.toString(),
      "heThongRapChieu.cumRapChieu.maCumRap": maCumRap.toString(),
    });

    for (let film of films) {
      for (let heThongRap of film.heThongRapChieu) {
        for (let cumRap of heThongRap.cumRapChieu) {
          if (cumRap.maCumRap === maCumRap.toString()) {
            cumRap.maCumRap = newMaCumRap;
            cumRap.tenCumRap = tenCumRap;
            cumRap.diaChi = diaChi;
            cumRap.hinhAnh = hinhAnh;
            cumRap.khuVuc = khuVuc;
            cumRap.hotline = hotline;
            cumRap.map = map;
            cumRap.banner = banner;
          }
        }
      }
      await film.save();
    }

    return res.status(200).json({
      message: "Cập nhật thông tin cụm rạp thành công",
      data: heThongRap,
    });
  } catch (e) {
    return res.status(500).send("ERROR 500:" + e.message);
  }
};

exports.addHeThongRap = async (req, res) => {
  try {
    const { tenHeThongRap, maHeThongRap, logo } = req.body;

    // Tạo mới một hệ thống rạp
    const newHeThongRap = new heThongRapSchema({
      tenHeThongRap,
      maHeThongRap,
      logo,
      cumRapChieu: [], // Khởi tạo mảng cụm rạp trống
    });

    await newHeThongRap.save();

    // Tạo mới trong lichChieuTheoPhimSchema
    await lichChieuTheoPhimSchema.create({
      maHeThongRap,
      tenHeThongRap,
      logo,
      cumRapChieu: [], // Khởi tạo mảng cụm rạp trống
    });

    // Cập nhật tất cả các phim hiện tại trong detailPhimSchema
    const films = await detailPhimSchema.find();
    for (let film of films) {
      film.heThongRapChieu.push({
        maHeThongRap,
        tenHeThongRap,
        logo,
        cumRapChieu: [], // Khởi tạo mảng cụm rạp trống
      });
      await film.save();
    }

    return res.status(201).json({
      message: "Tạo mới hệ thống rạp thành công",
      data: newHeThongRap,
    });
  } catch (e) {
    return res.status(500).send("ERROR 500:" + e.message);
  }
};

exports.deleteHeThongRap = async (req, res) => {
  try {
    const { maHeThongRap } = req.query;

    // Xóa hệ thống rạp trong heThongRapSchema
    const heThongRap = await heThongRapSchema.findOneAndDelete({
      maHeThongRap,
    });
    if (!heThongRap) {
      return res.status(404).send("He thong rap not found");
    }

    // Xóa hệ thống rạp trong lichChieuTheoPhimSchema
    await lichChieuTheoPhimSchema.deleteMany({ maHeThongRap });

    // Cập nhật tất cả các phim hiện tại trong detailPhimSchema để xóa hệ thống rạp
    const films = await detailPhimSchema.find({
      "heThongRapChieu.maHeThongRap": maHeThongRap,
    });
    for (let film of films) {
      film.heThongRapChieu = film.heThongRapChieu.filter(
        (heThongRap) => heThongRap.maHeThongRap !== maHeThongRap
      );
      await film.save();
    }

    return res.status(200).json({
      message: "Xóa hệ thống rạp thành công",
      data: heThongRap,
    });
  } catch (e) {
    return res.status(500).send("ERROR 500:" + e.message);
  }
};

exports.addCumRap = async (req, res) => {
  try {
    const {
      maHeThongRap,
      tenCumRap,
      maCumRap,
      diaChi,
      hinhAnh,
      khuVuc,
      hotline,
      map,
      banner,
    } = req.body;

    // Tạo mới cụm rạp
    const newCumRap = {
      maCumRap,
      tenCumRap,
      diaChi,
      hinhAnh,
      khuVuc,
      hotline,
      map,
      banner,
    };

    // Tìm hệ thống rạp và thêm cụm rạp mới vào trong heThongRapSchema
    const heThongRap = await heThongRapSchema.findOne({ maHeThongRap });
    if (!heThongRap) {
      return res.status(404).send("He thong rap not found");
    }

    heThongRap.cumRapChieu.push(newCumRap);
    await heThongRap.save();

    // Tìm và cập nhật lichChieuTheoPhimSchema
    await lichChieuTheoPhimSchema.updateMany(
      { maHeThongRap },
      {
        $push: {
          cumRapChieu: newCumRap,
        },
      }
    );

    // Tìm và cập nhật tất cả các phim trong detailPhimSchema
    const films = await detailPhimSchema.find({
      "heThongRapChieu.maHeThongRap": maHeThongRap.toString(),
    });

    for (let film of films) {
      for (let heThongRap of film.heThongRapChieu) {
        if (heThongRap.maHeThongRap === maHeThongRap.toString()) {
          heThongRap.cumRapChieu.push(newCumRap);
        }
      }
      await film.save();
    }

    return res.status(201).json({
      message: "Tạo mới cụm rạp thành công",
      data: newCumRap,
    });
  } catch (e) {
    return res.status(500).send("ERROR 500:" + e.message);
  }
};

exports.deleteCumRap = async (req, res) => {
  try {
    const { maCumRap } = req.query;

    // Xóa cụm rạp trong heThongRapSchema
    const heThongRap = await heThongRapSchema.updateMany(
      { "cumRapChieu.maCumRap": maCumRap.toString() },
      {
        $pull: { cumRapChieu: { maCumRap } },
      }
    );

    // Xóa cụm rạp trong lichChieuTheoPhimSchema
    await lichChieuTheoPhimSchema.updateMany(
      { "cumRapChieu.maCumRap": maCumRap.toString() },
      {
        $pull: { cumRapChieu: { maCumRap } },
      }
    );

    // Cập nhật tất cả các phim hiện tại trong detailPhimSchema để xóa cụm rạp
    const films = await detailPhimSchema.find({
      "heThongRapChieu.cumRapChieu.maCumRap": maCumRap.toString(),
    });
    for (let film of films) {
      for (let heThongRap of film.heThongRapChieu) {
        heThongRap.cumRapChieu = heThongRap.cumRapChieu.filter(
          (cumRap) => cumRap.maCumRap !== maCumRap.toString()
        );
      }
      await film.save();
    }

    return res.status(200).json({
      message: "Xóa cụm rạp thành công",
      data: heThongRap,
    });
  } catch (e) {
    return res.status(500).send("ERROR 500:" + e.message);
  }
};

exports.cumRapTheoKhuVuc = async (req, res) => {
  try {
    const { location, theater } = req.query;

    if (!location || !theater) {
      return res.status(400).send("Missing required query parameters");
    }

    // Find the theater with the given maHeThongRap
    const heThongRap = await heThongRapSchema.findOne({
      maHeThongRap: theater,
    });

    if (!heThongRap) {
      return res.status(404).send("Theater not found");
    }

    // Filter cumRapChieu by the given location
    const cumRapFiltered = heThongRap.cumRapChieu.filter(
      (cumRap) => cumRap.khuVuc === location
    );

    if (cumRapFiltered.length === 0) {
      return res
        .status(404)
        .send("No theaters found in the specified location");
    }

    return res.status(200).json({ data: cumRapFiltered });
  } catch (e) {
    return res.status(500).send("ERROR 500: " + e.message);
  }
};
