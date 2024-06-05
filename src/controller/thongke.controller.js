var lichChieuTheoPhimSchema = require("../schema/lichChieuTheoPhim.schema");
var thongkeSchema = require("../schema/thongke.schema");
const moment = require("moment");

exports.layDuLieuThongKeMoi = async (req, res) => {
  try {
    const currentMonthStart = moment().startOf("month").toDate();
    const currentMonthEnd = moment().endOf("month").toDate();
    const currentMonth = moment().startOf("month").toDate();

    const allData = await lichChieuTheoPhimSchema.find({
      "cumRapChieu.danhSachPhim.lstLichChieuTheoPhim.order.ngayDat": {
        $gte: currentMonthStart,
        $lte: currentMonthEnd,
      },
    });

    let totalTickets = 0;
    let totalAmount = 0;
    let detailedReport = [];

    allData.forEach((heThongRap) => {
      let heThongRapTotalTickets = 0;
      let heThongRapTotalAmount = 0;
      let cumRapDetails = [];

      heThongRap.cumRapChieu.forEach((cumRap) => {
        let cumRapTotalTickets = 0;
        let cumRapTotalAmount = 0;
        let phimDetails = [];

        cumRap.danhSachPhim.forEach((phim) => {
          let phimTotalTickets = 0;
          let phimTotalAmount = 0;

          phim.lstLichChieuTheoPhim.forEach((lichChieu) => {
            lichChieu.order.forEach((order) => {
              const orderDate = new Date(order.ngayDat);
              if (
                orderDate >= currentMonthStart &&
                orderDate <= currentMonthEnd
              ) {
                phimTotalTickets += order.soLuongGhe;
                phimTotalAmount += order.tongTien;
              }
            });
          });

          if (phimTotalTickets > 0 || phimTotalAmount > 0) {
            phimDetails.push({
              tenPhim: phim.tenPhim,
              maPhim: phim.maPhim,
              totalTickets: phimTotalTickets,
              totalAmount: phimTotalAmount,
            });
          }

          cumRapTotalTickets += phimTotalTickets;
          cumRapTotalAmount += phimTotalAmount;
        });

        if (cumRapTotalTickets > 0 || cumRapTotalAmount > 0) {
          cumRapDetails.push({
            tenCumRap: cumRap.tenCumRap,
            maCumRap: cumRap.maCumRap,
            totalTickets: cumRapTotalTickets,
            totalAmount: cumRapTotalAmount,
            phimDetails,
          });
        }

        heThongRapTotalTickets += cumRapTotalTickets;
        heThongRapTotalAmount += cumRapTotalAmount;
      });

      if (heThongRapTotalTickets > 0 || heThongRapTotalAmount > 0) {
        detailedReport.push({
          tenHeThongRap: heThongRap.tenHeThongRap,
          maHeThongRap: heThongRap.maHeThongRap,
          totalTickets: heThongRapTotalTickets,
          totalAmount: heThongRapTotalAmount,
          cumRapDetails,
        });
      }

      totalTickets += heThongRapTotalTickets;
      totalAmount += heThongRapTotalAmount;
    });

    // Kiểm tra và cập nhật hoặc tạo mới trong thongkeSchema
    const currentYear = moment().year();
    const currentMonthNumber = moment().month() + 1;

    let thongKeRecord = await thongkeSchema.findOne({
      year: currentYear,
      month: currentMonthNumber,
    });

    if (thongKeRecord) {
      thongKeRecord.totalTickets = totalTickets;
      thongKeRecord.totalAmount = totalAmount;
      thongKeRecord.detailedReport = detailedReport;
    } else {
      thongKeRecord = new thongkeSchema({
        year: currentYear,
        month: currentMonthNumber,
        totalTickets,
        totalAmount,
        detailedReport,
      });
    }

    await thongKeRecord.save();

    return res.status(200).json({
      totalTickets,
      totalAmount,
      detailedReport,
    });
  } catch (e) {
    res.status(500).send("ERROR 500: " + e.message);
  }
};

exports.thongKeTheoThang = async (req, res) => {
  try {
    const currentYear = moment().year();
    const currentMonthNumber = moment().month() + 1;
    let thongKeRecord = await thongkeSchema.findOne({
      year: currentYear,
      month: currentMonthNumber,
    });

    if (!thongKeRecord) {
      return res
        .status(404)
        .send("Không tìm thấy dữ liệu thống kê cho tháng này");
    }

    return res.status(200).json(thongKeRecord);
  } catch (e) {
    res.status(500).send("ERROR 500: " + e.message);
  }
};

exports.thongKeThangTruoc = async (req, res) => {
  try {
    const currentYear = moment().year();
    const previousMonthNumber = moment().month();
    let thongKeRecord = await thongkeSchema.findOne({
      year: currentYear,
      month: previousMonthNumber,
    });

    if (!thongKeRecord) {
      return res
        .status(404)
        .send("Không tìm thấy dữ liệu thống kê cho tháng này");
    }

    return res.status(200).json(thongKeRecord);
  } catch (e) {
    res.status(500).send("ERROR 500: " + e.message);
  }
};

exports.layThongKe7Ngay = async (req, res) => {
  try {
    const startDate = moment().subtract(7, "days").startOf("day").toDate();
    const endDate = moment().endOf("day").toDate();

    const result = await lichChieuTheoPhimSchema.aggregate([
      {
        $unwind: "$cumRapChieu",
      },
      {
        $unwind: "$cumRapChieu.danhSachPhim",
      },
      {
        $unwind: "$cumRapChieu.danhSachPhim.lstLichChieuTheoPhim",
      },
      {
        $unwind: "$cumRapChieu.danhSachPhim.lstLichChieuTheoPhim.order",
      },
      {
        $match: {
          "cumRapChieu.danhSachPhim.lstLichChieuTheoPhim.order.ngayDat": {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            maHeThongRap: "$maHeThongRap",
            tenHeThongRap: "$tenHeThongRap",
            ngayDat: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$cumRapChieu.danhSachPhim.lstLichChieuTheoPhim.order.ngayDat",
              },
            },
          },
          totalTickets: {
            $sum: "$cumRapChieu.danhSachPhim.lstLichChieuTheoPhim.order.soLuongGhe",
          },
          totalAmount: {
            $sum: "$cumRapChieu.danhSachPhim.lstLichChieuTheoPhim.order.tongTien",
          },
        },
      },
      {
        $project: {
          _id: 0,
          maHeThongRap: "$_id.maHeThongRap",
          tenHeThongRap: "$_id.tenHeThongRap",
          ngayDat: "$_id.ngayDat",
          totalTickets: 1,
          totalAmount: 1,
        },
      },
      {
        $sort: { ngayDat: 1 },
      },
    ]);

    res.status(200).json(result);
  } catch (e) {
    res.status(500).send("ERROR 500: " + e.message);
  }
};
