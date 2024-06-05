const Film = require("../schema/DetailPhim.schema");

exports.getFilmDetail = async (req, res) => {
  const { MaPhim } = req.query;
  // console.log(MaPhim);
  try {
    const film = await Film.findOne({ maPhim: MaPhim });

    if (!film) {
      return res.status(404).json({ message: "Film not found" });
    }

    res.json(film);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.saveDetailPhim = async (req, res) => {
  try {
    const film = req.body;
    // console.log(req.body);
    if (film) {
      const newDetail = new Film(film);
      await newDetail.save();
      // await dataSchema.create(data);
      // console.log(film);
      res.status(200).json({ film });
    }
  } catch (e) {
    res.status(500).send("ERROR 500:" + e.message);
  }
};

exports.rating = async (req, res) => {
  try {
    const { taiKhoan, rating, maPhim } = req.body;

    // Tìm phim dựa trên maPhim
    const film = await Film.findOne({ maPhim });

    // Kiểm tra xem phim có tồn tại hay không
    if (!film) {
      return res.status(404).json({ message: "Film not found" });
    }

    // Tìm đánh giá của tài khoản trong mảng rating
    const userRating = film.rating.find((r) => r.taiKhoan === taiKhoan);

    if (userRating) {
      // Nếu tài khoản đã đánh giá, cập nhật đánh giá
      userRating.rate = rating;
    } else {
      // Nếu tài khoản chưa đánh giá, thêm đánh giá mới
      film.rating.push({ taiKhoan, rate: rating });
    }

    // Lưu thay đổi
    await film.save();

    res.status(200).json({ message: "Rating updated successfully" });
  } catch (e) {
    res.status(500).send("ERROR 500:" + e.message);
  }
};
