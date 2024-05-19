var lichChieuTheoPhimSchema = require("../schema/lichChieuTheoPhim.schema");
var detailFilm = require("../schema/DetailPhim.schema");
const maPhimMaLichChieuSchema = require("../schema/maPhim_maLichChieu.schema");

const moment = require("moment");

exports.getData = async (req, res) => {
  try {
    const allData = await lichChieuTheoPhimSchema.find();
    return res.status(200).json({ data: allData });
  } catch (e) {
    // Handle errors
    res.status(500).send("ERROR 500:" + e.message);
  }
};

exports.getAllHeThongRap = async (req, res) => {
  try {
    // Use .find() with a projection to exclude the lstCumRap field
    const allHeThongRap = await lichChieuTheoPhimSchema.find(
      {},
      { cumRapChieu: 0 }
    );
    return res.status(200).json({ data: allHeThongRap });
  } catch (e) {
    // Handle errors
    res.status(500).send("ERROR 500:" + e.message);
  }
};

exports.getCumRap = async (req, res) => {
  try {
    const { tenHeThongRap } = req.query; // Lấy maHeThongRap từ query parameters

    // Tìm bản ghi ứng với maHeThongRap
    const heThongRap = await lichChieuTheoPhimSchema.findOne(
      { tenHeThongRap: tenHeThongRap },
      { "cumRapChieu.danhSachPhim": 0 }
    );

    if (!heThongRap) {
      return res.status(404).send("HeThongRap not found");
    }

    // Trả về mảng lstCumRap
    res.status(200).json({ cumRapChieu: heThongRap.cumRapChieu });
  } catch (e) {
    res.status(500).send("ERROR 500:" + e.message);
  }
};

exports.saveLichChieuTheoPhim = async (req, res) => {
  try {
    let maLichChieuRecord = await maPhimMaLichChieuSchema.findOne();

    if (!maLichChieuRecord) {
      return res.status(404).send("maLichChieu record not found");
    }

    const newMaLichChieu = maLichChieuRecord.maLichChieu + 1;
    await maPhimMaLichChieuSchema.updateOne(
      {},
      { maLichChieu: newMaLichChieu }
    );

    const {
      maPhim,
      tenHeThongRap,
      maRap,
      ngayChieuGioChieu,
      giaVe,
      thoiLuong,
    } = req.body;

    const isoNgayChieuGioChieu = moment(
      ngayChieuGioChieu,
      "DD/MM/YYYY HH:mm:ss"
    ).toISOString();
    const detailFilmRecord = await detailFilm.findOne({ maPhim: maPhim });

    if (!detailFilmRecord) {
      return res.status(404).send("Detail film record not found");
    }

    const heThongRap = detailFilmRecord.heThongRapChieu.find(
      (heThongRap) => heThongRap.tenHeThongRap === tenHeThongRap
    );

    if (!heThongRap) {
      return res.status(404).send("HeThongRap not found in detailFilm");
    }

    const cumRap = heThongRap.cumRapChieu.find(
      (cumRap) => cumRap.maCumRap === maRap
    );

    if (!cumRap) {
      return res.status(404).send("CumRap not found in heThongRap");
    }

    const newLichChieuPhim = {
      maLichChieu: newMaLichChieu,
      ngayChieuGioChieu: isoNgayChieuGioChieu,
      giaVe,
      thoiLuong,
    };

    cumRap.lichChieuPhim.push(newLichChieuPhim);
    await detailFilmRecord.save();

    // Tìm và cập nhật trong lichChieuTheoPhimSchema
    const lichChieuTheoPhimRecord = await lichChieuTheoPhimSchema.findOne({
      tenHeThongRap: tenHeThongRap,
    });

    if (!lichChieuTheoPhimRecord) {
      return res.status(404).send("lichChieuTheoPhim record not found");
    }

    const cumRapInLichChieuTheoPhim = lichChieuTheoPhimRecord.cumRapChieu.find(
      (cumRap) => cumRap.maCumRap === maRap
    );

    if (!cumRapInLichChieuTheoPhim) {
      return res.status(404).send("CumRap not found in lichChieuTheoPhim");
    }
    const maPhimInt = parseInt(maPhim);
    const phimInDanhSachPhim = cumRapInLichChieuTheoPhim.danhSachPhim.find(
      (phim) => phim.maPhim === maPhimInt
    );

    if (!phimInDanhSachPhim) {
      return res.status(404).send("Phim not found in danhSachPhim");
    }

    phimInDanhSachPhim.lstLichChieuTheoPhim.push(newLichChieuPhim);
    await lichChieuTheoPhimRecord.save();

    res.status(201).json({
      message: "Lịch chiếu phim đã được thêm thành công",
      maLichChieu: newMaLichChieu,
    });
  } catch (e) {
    res.status(500).send("ERROR 500:" + e.message);
  }
};
