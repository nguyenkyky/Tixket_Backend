var lichChieuTheoPhimSchema = require("../schema/lichChieuTheoPhim.schema");
var detailFilm = require("../schema/DetailPhim.schema");
const maPhimMaLichChieuSchema = require("../schema/maPhim_maLichChieu.schema");
var phongVeSchema = require("../schema/phongve.schema");
const dayjs = require("dayjs");
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

exports.getAllShowtimes = async (req, res) => {
  try {
    // Lấy tất cả các bản ghi từ lichChieuTheoPhimSchema
    const allData = await lichChieuTheoPhimSchema.find();

    // Mảng để chứa tất cả các lịch chiếu
    const allShowtimes = [];

    // Duyệt qua từng bản ghi
    allData.forEach((heThongRap) => {
      heThongRap.cumRapChieu.forEach((cumRap) => {
        cumRap.danhSachPhim.forEach((phim) => {
          phim.lstLichChieuTheoPhim.forEach((lichChieu) => {
            // Gộp tất cả các bản ghi trong lstLichChieuTheoPhim vào mảng
            allShowtimes.push({
              ...lichChieu._doc, // Lấy toàn bộ thông tin của lịch chiếu
              tenHeThongRap: heThongRap.tenHeThongRap, // Thêm thông tin tên hệ thống rạp
              tenCumRap: cumRap.tenCumRap, // Thêm thông tin tên cụm rạp
              tenPhim: phim.tenPhim, // Thêm thông tin tên phim
              maPhim: phim.maPhim, // Thêm thông tin mã phim
            });
          });
        });
      });
    });

    // Trả về mảng tất cả các lịch chiếu
    return res.status(200).json({ data: allShowtimes });
  } catch (e) {
    // Xử lý lỗi
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

exports.getLichChieuTheoCumRap = async (req, res) => {
  try {
    const { maCumRap } = req.query; // Lấy tenHeThongRap và maCumRap từ body
    const { tenHeThongRap } = req.query;

    // Tìm bản ghi ứng với tenHeThongRap
    const heThongRap = await lichChieuTheoPhimSchema.findOne({
      tenHeThongRap: tenHeThongRap,
    });

    if (!heThongRap) {
      return res.status(404).send("HeThongRap not found");
    }

    // Tìm cumRap ứng với maCumRap trong heThongRap
    const cumRap = heThongRap.cumRapChieu.find(
      (cumRap) => cumRap.maCumRap === maCumRap.toString()
    );

    if (!cumRap) {
      return res.status(404).send("CumRap not found in heThongRap");
    }

    // Trả về mảng danhSachPhim nằm bên trong cumRap
    res.status(200).json({ danhSachPhim: cumRap.danhSachPhim });
  } catch (e) {
    res.status(500).send("ERROR 500:" + e.message);
  }
};

exports.getLichChieuTheoCumRap2 = async (req, res) => {
  try {
    const { maCumRap } = req.query; // Lấy tenHeThongRap và maCumRap từ body
    const { maHeThongRap } = req.query;

    // Tìm bản ghi ứng với tenHeThongRap
    const heThongRap = await lichChieuTheoPhimSchema.findOne({
      maHeThongRap: maHeThongRap,
    });

    if (!heThongRap) {
      return res.status(404).send("HeThongRap not found");
    }

    // Tìm cumRap ứng với maCumRap trong heThongRap
    const cumRap = heThongRap.cumRapChieu.find(
      (cumRap) => cumRap.maCumRap === maCumRap.toString()
    );

    if (!cumRap) {
      return res.status(404).send("CumRap not found in heThongRap");
    }

    // Trả về mảng danhSachPhim nằm bên trong cumRap
    res.status(200).json({ danhSachPhim: cumRap.danhSachPhim });
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
      tenPhim,
      hinhAnh,
      hot,
      sapChieu,
      dangChieu,
      theLoai,
      dienVien,
    } = req.body;

    // console.log("ngay chieu gio chieu", ngayChieuGioChieu);

    // const isoNgayChieuGioChieu = moment(
    //   ngayChieuGioChieu,
    //   "DD/MM/YYYY HH:mm:ss"
    // ).toISOString();

    const isoNgayChieuGioChieu = dayjs(ngayChieuGioChieu);

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

    // Check for existing schedule with the same date and time in the same cumRap
    const existingSchedule = cumRap.lichChieuPhim.find((lichChieu) =>
      dayjs(lichChieu.ngayChieuGioChieu).isSame(isoNgayChieuGioChieu)
    );

    if (existingSchedule) {
      return res
        .status(400)
        .send("Lịch chiếu đã tồn tại trong cùng một cụm rạp");
    }

    const newLichChieuPhim = {
      maLichChieu: newMaLichChieu,
      ngayChieuGioChieu: ngayChieuGioChieu,
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

    // Check for existing schedule with the same date and time in the same cumRap across all movies in lichChieuTheoPhim
    for (const phim of cumRapInLichChieuTheoPhim.danhSachPhim) {
      for (const lichChieu of phim.lstLichChieuTheoPhim) {
        if (dayjs(lichChieu.ngayChieuGioChieu).isSame(isoNgayChieuGioChieu)) {
          return res
            .status(400)
            .send("Lịch chiếu đã tồn tại trong cùng một cụm rạp");
        }
      }
    }

    const maPhimInt = parseInt(maPhim);
    const phimInDanhSachPhim = cumRapInLichChieuTheoPhim.danhSachPhim.find(
      (phim) => phim.maPhim === maPhimInt
    );

    if (!phimInDanhSachPhim) {
      // Nếu phim không tồn tại, thêm một phim mới vào danh sách
      const newPhim = {
        maPhim: maPhimInt,
        tenPhim,
        hinhAnh,
        hot,
        dangChieu,
        sapChieu,
        thoiLuong,
        theLoai,
        dienVien,
        lstLichChieuTheoPhim: [newLichChieuPhim],
      };
      cumRapInLichChieuTheoPhim.danhSachPhim.push(newPhim);
    }

    if (phimInDanhSachPhim) {
      phimInDanhSachPhim.lstLichChieuTheoPhim.push(newLichChieuPhim);
    }

    await lichChieuTheoPhimRecord.save();
    // Thêm phòng vé
    let maGheRecord = await maPhimMaLichChieuSchema.findOne();

    if (!maGheRecord) {
      return res.status(404).send("maGhe record not found");
    }
    const newMaGhe = maGheRecord.maGhe + 1;
    const danhSachGhe = [];
    // Define VIP seat ranges
    const vipSeatRanges = [
      [35, 46],
      [51, 62],
      [67, 78],
      [83, 94],
      [99, 110],
      [115, 126],
    ];

    for (let i = 1; i <= 160; i++) {
      let loaiGhe = "Thuong";
      let giaGhe = giaVe;

      // Check if the current seat falls within any VIP range
      for (const range of vipSeatRanges) {
        if (i >= range[0] && i <= range[1]) {
          loaiGhe = "Vip";
          giaGhe = giaVe + 20000;
          break;
        }
      }

      danhSachGhe.push({
        maGhe: newMaGhe + i,
        tenGhe: i.toString().padStart(2, "0"),

        loaiGhe: loaiGhe,
        stt: i.toString().padStart(2, "0"),
        giaVe: giaGhe,
        daDat: false,
        taiKhoanNguoiDat: null,
      });
    }

    const thongTinPhim = {
      maLichChieu: newMaLichChieu,
      tenHeThongRap: heThongRap.tenHeThongRap,
      tenCumRap: cumRap.tenCumRap,
      tenRap: cumRap.tenRap,
      map: cumRap.map,
      diaChi: cumRap.diaChi,
      tenPhim: detailFilmRecord.tenPhim,
      hinhAnh: detailFilmRecord.hinhAnh,
      ngayChieu: isoNgayChieuGioChieu.format("DD/MM/YYYY"),
      gioChieu: isoNgayChieuGioChieu.format("HH:mm"),
    };

    const newPhongVe = new phongVeSchema({
      thongTinPhim: thongTinPhim,
      danhSachGhe: danhSachGhe,
    });

    await newPhongVe.save();
    await maPhimMaLichChieuSchema.updateOne({}, { maGhe: newMaGhe + 161 });

    res.status(201).json({
      message: "Lịch chiếu phim đã được thêm thành công",
      maLichChieu: newMaLichChieu,
    });
  } catch (e) {
    res.status(500).send("ERROR 500:" + e.message);
  }
};

exports.xoaLichChieuPhim = async (req, res) => {
  try {
    const { maLichChieu } = req.query;

    if (!maLichChieu) {
      return res.status(400).send("maLichChieu is required");
    }

    const maLichChieuInt = parseInt(maLichChieu);

    // Xóa lịch chiếu trong detailFilm
    const detailFilmRecord = await detailFilm.findOne({
      "heThongRapChieu.cumRapChieu.lichChieuPhim.maLichChieu": maLichChieuInt,
    });

    if (!detailFilmRecord) {
      return res.status(404).send("Detail film record not found");
    }

    detailFilmRecord.heThongRapChieu.forEach((heThongRap) => {
      heThongRap.cumRapChieu.forEach((cumRap) => {
        cumRap.lichChieuPhim = cumRap.lichChieuPhim.filter(
          (lichChieu) => lichChieu.maLichChieu !== maLichChieuInt
        );
      });
    });

    await detailFilmRecord.save();

    // Xóa lịch chiếu trong lichChieuTheoPhimSchema
    const lichChieuTheoPhimRecord = await lichChieuTheoPhimSchema.findOne({
      "cumRapChieu.danhSachPhim.lstLichChieuTheoPhim.maLichChieu":
        maLichChieuInt,
    });

    if (!lichChieuTheoPhimRecord) {
      return res.status(404).send("lichChieuTheoPhim record not found");
    }

    lichChieuTheoPhimRecord.cumRapChieu.forEach((cumRap) => {
      cumRap.danhSachPhim.forEach((phim) => {
        phim.lstLichChieuTheoPhim = phim.lstLichChieuTheoPhim.filter(
          (lichChieu) => lichChieu.maLichChieu !== maLichChieuInt
        );
      });
    });

    await lichChieuTheoPhimRecord.save();

    // Xóa phòng vé
    const result = await phongVeSchema.deleteOne({
      "thongTinPhim.maLichChieu": maLichChieuInt,
    });

    if (result.deletedCount === 0) {
      return res.status(404).send("Phòng vé not found");
    }

    res.status(200).json({
      message: "Lịch chiếu phim đã được xóa thành công",
      maLichChieu: maLichChieuInt,
    });
  } catch (e) {
    res.status(500).send("ERROR 500:" + e.message);
  }
};
