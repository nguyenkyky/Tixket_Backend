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
