var phongveSchema = require("../schema/phongve.schema");
var userSchema = require("../schema/users.schema");
var maPhim_maLichChieuSchema = require("../schema/maPhim_maLichChieu.schema");
var lichChieuTheoPhimSchema = require("../schema/lichChieuTheoPhim.schema");
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
    orderId,
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
        maGhe: danhSachVe.map((ve) => ve.maGhe),
        tenGhe: danhSachVe.map((ve) => ve.tenGhe),
      },

      orderId: orderId,
      tenHeThongRap: lichChieu.thongTinPhim.tenHeThongRap,
      tenCumRap: lichChieu.thongTinPhim.tenCumRap,

      giaVe: tongTien,
      tenPhim: lichChieu.thongTinPhim.tenPhim,
      ngayDat: new Date(),
      ngayChieu: ngayChieu,
      gioChieu: gioChieu,
      diaChi: diaChi,
      hinhAnh: hinhAnh,
    };
    user.tongChiTieu = user.tongChiTieu + tongTien;
    user.thongTinDatVe.push(ThongTinDatVe);
    await user.save();
    await phongveSchema.bulkWrite(updateOps);

    // Bổ sung logic để cập nhật vào lichChieuTheoPhimSchema(2/6)
    const lichChieuTheoPhimRecord = await lichChieuTheoPhimSchema.findOne({
      tenHeThongRap: lichChieu.thongTinPhim.tenHeThongRap,
    });

    if (!lichChieuTheoPhimRecord) {
      return res
        .status(404)
        .json({ message: "lichChieuTheoPhim record not found" });
    }

    const cumRap = lichChieuTheoPhimRecord.cumRapChieu.find(
      (cumRap) => cumRap.tenCumRap === lichChieu.thongTinPhim.tenCumRap
    );

    if (!cumRap) {
      return res
        .status(404)
        .json({ message: "CumRap not found in lichChieuTheoPhim" });
    }

    const phim = cumRap.danhSachPhim.find(
      (phim) => phim.tenPhim === lichChieu.thongTinPhim.tenPhim
    );

    if (!phim) {
      return res
        .status(404)
        .json({ message: "Phim not found in danhSachPhim" });
    }

    const maLichChieuInt = parseInt(maLichChieu);
    const lichChieuPhim = phim.lstLichChieuTheoPhim.find(
      (lich) => lich.maLichChieu === maLichChieuInt
    );

    if (!lichChieuPhim) {
      return res
        .status(404)
        .json({ message: "LichChieuPhim not found in lstLichChieuTheoPhim" });
    }

    // Thêm order vào mảng order của lichChieuPhim
    lichChieuPhim.order.push({
      orderId,
      nguoiDat: user.taiKhoan,
      soLuongGhe: danhSachVe.length,
      tongTien,
    });

    await lichChieuTheoPhimRecord.save();

    return res.status(200).json({ message: "Đặt vé thành công." });
  } catch (e) {
    res.status(500).send("ERROR 500: " + e.message);
  }
};

exports.orderId = async (req, res) => {
  try {
    let OrderIdRecord = await maPhim_maLichChieuSchema.findOne();

    if (!OrderIdRecord) {
      return res.status(404).send("OrderId record not found");
    }

    const newOrderId = OrderIdRecord.orderId + 1;

    await maPhim_maLichChieuSchema.updateOne({}, { orderId: newOrderId });
    res.json(newOrderId);
  } catch (e) {
    res.status(500).send("ERROR 500:" + e.message);
  }
};
