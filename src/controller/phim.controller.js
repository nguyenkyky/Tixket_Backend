var phimSchema = require("../schema/phim.schema");
var detailPhimSchema = require("../schema/DetailPhim.schema");
var heThongRapSchema = require("../schema/heThongRap.schema");
var lichChieuTheoPhimSchema = require("../schema/lichChieuTheoPhim.schema");
const maPhimMaLichChieuSchema = require("../schema/maPhim_maLichChieu.schema");

exports.getData = async (req, res) => {
  try {
    const allData = await phimSchema.find();
    return res.status(200).json({ data: allData });
  } catch (e) {
    // Handle errors
    res.status(500).send("ERROR 500:" + e.message);
  }
};

exports.savePhim = async (req, res) => {
  try {
    let maPhimRecord = await maPhimMaLichChieuSchema.findOne();

    if (!maPhimRecord) {
      return res.status(404).send("maPhim record not found");
    }

    const newMaPhim = maPhimRecord.maPhim + 1;

    await maPhimMaLichChieuSchema.updateOne({}, { maPhim: newMaPhim });

    const heThongRapChieu = await heThongRapSchema.find();
    const {
      dangChieu,
      danhGia,
      daoDien,
      dienVien,
      hinhAnh,
      hot,
      moTa,
      ngayKhoiChieu,
      sapChieu,
      tenPhim,
      thoiLuong,
      trailer,
      theLoai,
    } = req.body;

    const danhSachPhimEntry = {
      // lstLichChieuTheoPhim: [], // Danh sách lịch chiếu theo phim
      maPhim: newMaPhim,
      tenPhim,
      hinhAnh,
      hot,
      dangChieu,
      sapChieu,
      thoiLuong,
      theLoai,
      dienVien,
    };

    const newPhim = new phimSchema({
      maPhim: newMaPhim,
      dangChieu,
      danhGia,
      daoDien,
      dienVien,
      hinhAnh,
      hot,
      moTa,
      ngayKhoiChieu: new Date(ngayKhoiChieu.split("/").reverse().join("-")),
      sapChieu,
      tenPhim,
      thoiLuong,
      trailer,
      theLoai,
    });

    const newDetailPhim = new detailPhimSchema({
      heThongRapChieu: heThongRapChieu,
      maPhim: newMaPhim,
      dangChieu,
      danhGia,
      daoDien,
      dienVien,
      hinhAnh,
      hot,
      moTa,
      ngayKhoiChieu: new Date(ngayKhoiChieu.split("/").reverse().join("-")),
      sapChieu,
      tenPhim,
      thoiLuong,
      trailer,
      theLoai,
    });

    await newPhim.save();
    await newDetailPhim.save();

    const lichChieuTheoPhimDocs = await lichChieuTheoPhimSchema.find();
    // console.log(lichChieuTheoPhimDocs.cumRapChieu);
    for (let lichChieuTheoPhimDoc of lichChieuTheoPhimDocs) {
      for (let cumRapChieu of lichChieuTheoPhimDoc.cumRapChieu) {
        cumRapChieu.danhSachPhim.push(danhSachPhimEntry);
      }
      await lichChieuTheoPhimDoc.save();
    }

    res.status(201).json({ message: "Phim saved successfully", phim: newPhim });
  } catch (e) {
    res.status(500).send("ERROR 500:" + e.message);
  }
};

exports.timKiemPhim = async (req, res) => {
  try {
    const { MaPhim } = req.query; // Lấy id từ param

    const phim = await phimSchema.findOne({ maPhim: MaPhim }); // Tìm phim với maPhim = id

    if (!phim) {
      return res.status(404).send("Phim not found");
    }

    res.status(200).json(phim); // Trả về phim tìm được
  } catch (error) {
    res.status(500).send("Server error: " + error.message);
  }
};

exports.capNhatPhim = async (req, res) => {
  try {
    const {
      maPhim,
      dangChieu,
      danhGia,
      daoDien,
      dienVien,
      hinhAnh,
      hot,
      moTa,
      ngayKhoiChieu,
      sapChieu,
      tenPhim,
      thoiLuong,
      trailer,
      theLoai,
    } = req.body;

    console.log(theLoai);
    console.log(theLoai.length);

    // Convert ngayKhoiChieu from "DD/MM/YYYY" to "YYYY-MM-DD"
    const formattedNgayKhoiChieu = ngayKhoiChieu.split("/").reverse().join("-");

    // Prepare update object
    const updateData = {
      dangChieu,
      danhGia,
      daoDien,
      dienVien,
      hinhAnh,
      hot,
      moTa,
      ngayKhoiChieu: new Date(formattedNgayKhoiChieu),
      sapChieu,
      tenPhim,
      thoiLuong,
      trailer,
    };

    // Add 'theLoai' to the update object only if it's not an empty array
    if (theLoai && theLoai.length > 0) {
      updateData.theLoai = theLoai;
    } else {
      updateData.theLoai = [];
    }

    const updatedPhim = await phimSchema.findOneAndUpdate(
      { maPhim: maPhim },
      { $set: updateData },
      { new: true }
    );

    await detailPhimSchema.findOneAndUpdate(
      { maPhim: maPhim },
      { $set: updateData },
      { new: true }
    );

    const lichChieuTheoPhimDocs = await lichChieuTheoPhimSchema.find();

    for (let lichChieuTheoPhimDoc of lichChieuTheoPhimDocs) {
      for (let cumRapChieu of lichChieuTheoPhimDoc.cumRapChieu) {
        for (let phim of cumRapChieu.danhSachPhim) {
          if (phim.maPhim === maPhim) {
            phim.tenPhim = tenPhim;
            phim.hinhAnh = hinhAnh;
            phim.hot = hot;
            phim.dangChieu = dangChieu;
            phim.sapChieu = sapChieu;
            phim.thoiLuong = thoiLuong;
            phim.theLoai =
              theLoai && theLoai.length > 0 ? theLoai : phim.theLoai;
            phim.dienVien = dienVien;
          }
        }
      }
      await lichChieuTheoPhimDoc.save();
    }

    if (!updatedPhim) {
      return res.status(404).send("Phim not found");
    }

    res
      .status(200)
      .json({ message: "Phim updated successfully", phim: updatedPhim });
  } catch (e) {
    res.status(500).send("ERROR 500:" + e.message);
  }
};

exports.xoaPhim = async (req, res) => {
  try {
    const { MaPhim } = req.query;

    // Xóa phim trong phimSchema
    const deletedPhim = await phimSchema.findOneAndDelete({ maPhim: MaPhim });

    // Xóa phim trong detailPhimSchema
    await detailPhimSchema.findOneAndDelete({ maPhim: MaPhim });

    // Cập nhật lichChieuTheoPhimSchema để loại bỏ phim khỏi danhSachPhim
    const lichChieuTheoPhimDocs = await lichChieuTheoPhimSchema.find();

    for (let lichChieuTheoPhimDoc of lichChieuTheoPhimDocs) {
      for (let cumRapChieu of lichChieuTheoPhimDoc.cumRapChieu) {
        cumRapChieu.danhSachPhim = cumRapChieu.danhSachPhim.filter(
          (phim) => phim.maPhim !== parseInt(MaPhim)
        );
      }
      await lichChieuTheoPhimDoc.save();
    }

    if (!deletedPhim) {
      return res.status(404).send("Phim not found");
    }

    res.status(200).json({ message: "Phim deleted successfully" });
  } catch (e) {
    res.status(500).send("ERROR 500:" + e.message);
  }
};
exports.find = async (req, res) => {
  try {
    const { data } = req.query; // Lấy dữ liệu từ body
    // console.log(data);
    // Tìm kiếm phim theo tên phim hoặc diễn viên chứa từ khóa
    const phimTimDuoc = await phimSchema.find({
      $or: [
        { tenPhim: { $regex: data, $options: "i" } }, // Tìm kiếm không phân biệt hoa thường trong tên phim
        { dienVien: { $elemMatch: { $regex: data, $options: "i" } } }, // Tìm kiếm không phân biệt hoa thường trong mảng diễn viên
      ],
    });

    if (!phimTimDuoc.length) {
      return res.status(404).send("Không tìm thấy phim nào.");
    }

    res.status(200).json({ message: "Tìm kiếm thành công", phim: phimTimDuoc });
  } catch (e) {
    res.status(500).send("ERROR 500:" + e.message);
  }
};
