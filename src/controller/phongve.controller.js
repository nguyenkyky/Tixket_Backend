var phongveSchema = require("../schema/phongve.schema");
var userSchema = require("../schema/users.schema");

exports.getData = async (req, res) => {
  const { MaLichChieu } = req.query;
  try {
    const lichChieu = await phongveSchema.findOne({
      "thongTinPhim.maLichChieu": MaLichChieu,
    });
    if (!lichChieu) {
      return res
        .status(404)
        .json({ message: "No data found with this maLichChieu" });
    }
    return res.status(200).json({ data: lichChieu });
  } catch (e) {
    res.status(500).send("ERROR 500:" + e.message);
  }
};

exports.kiemTraDatVe = async (req, res) => {
  const { danhSachVe, maLichChieu } = req.body;
  const lichChieu = await phongveSchema.findOne({
    "thongTinPhim.maLichChieu": maLichChieu,
  });
  if (!lichChieu) {
    return res.status(404).json({ message: "Lịch chiếu không tồn tại." });
  }

  // Bước 2 và 3: Quét danhSachVe và tìm trong danhSachGhe
  const gheKhongHopLe = [];
  for (const ve of danhSachVe) {
    const ghe = lichChieu.danhSachGhe.find((g) => g.maGhe === ve.maGhe);
    if (!ghe || ghe.daDat) {
      gheKhongHopLe.push(ve.stt);
    }
  }

  if (gheKhongHopLe.length > 0) {
    return res.status(400).json({
      message: `Ghế đã được người khác đặt: ${gheKhongHopLe.join(", ")}.`,
      gheKhongHopLe,
    });
  }

  return res.status(200).json({ message: "Tất cả ghế đều hợp lệ." });
};

exports.datVe = async (req, res) => {
  const {
    maLichChieu,
    danhSachVe,
    tongTien,
    ngayChieu,
    gioChieu,
    diaChi,
    hinhAnh,
  } = req.body;
  const userId = req.user.id;
  try {
    const user = await userSchema.findById(userId); // Tìm người dùng dựa trên userId
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }
    // Tìm lịch chiếu theo maLichChieu
    const lichChieu = await phongveSchema.findOne({
      "thongTinPhim.maLichChieu": maLichChieu,
    });
    if (!lichChieu) {
      return res.status(404).json({ message: "Lịch chiếu không tồn tại." });
    }

    const updateOps = danhSachVe.map((ve) => ({
      updateOne: {
        filter: {
          "danhSachGhe.maGhe": ve.maGhe,
          "thongTinPhim.maLichChieu": maLichChieu,
        },
        update: {
          $set: {
            "danhSachGhe.$.daDat": true,
            "danhSachGhe.$.taiKhoanNguoiDat": user.hoTen, // Cập nhật hoTen vào taiKhoanNguoiDat
          },
        },
      },
    }));

    const ThongTinDatVe = {
      danhSachGhe: {
        maHeThongRap: lichChieu.thongTinPhim.tenCumRap,
        tenHeThongRap: lichChieu.thongTinPhim.tenCumRap,
        maCumRap: lichChieu.thongTinPhim.tenRap,
        tenCumRap: lichChieu.thongTinPhim.tenRap,
        maRap: lichChieu.thongTinPhim.tenRap,
        tenRap: lichChieu.thongTinPhim.tenRap,
        maGhe: danhSachVe.map((ve) => ve.maGhe),
        tenGhe: danhSachVe.map((ve) => ve.tenGhe),
      },
      giaVe: tongTien,
      tenPhim: lichChieu.thongTinPhim.tenPhim,
      ngayDat: new Date(),
      ngayChieu: ngayChieu,
      gioChieu: gioChieu,
      diaChi: diaChi,
      hinhAnh: hinhAnh,
    };

    user.thongTinDatVe.push(ThongTinDatVe);
    await user.save();
    await phongveSchema.bulkWrite(updateOps);

    return res.status(200).json({ message: "Đặt vé thành công." });
  } catch (e) {
    res.status(500).send("ERROR 500: " + e.message);
  }
};
