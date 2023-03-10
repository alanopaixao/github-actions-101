const prisma = require("../../prisma");

exports.findAll = (req, res) => {
  const name = req.query.name;
  const condition = name
    ? { where: { name: { contains: name, mode: "insensitive" } } }
    : {};

  prisma.artist
    .findMany(condition)
    .then((data) => {
      res.send({ data });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving artists.",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  prisma.artist
    .findUnique({ where: { id: Number(id) } })
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Artist with id " + id });
      else res.send({ data });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Artist with id=" + id });
    });
};

exports.getTopThree = (req, res) => {
  prisma.artist
    .findMany({
      include: {
        songs: true,
      },
    })
    .then((data) => {
      data = data
        .map((artist) => {
          const toReturn = {
            ...artist,
            totalPlaybacks: artist.songs.reduce(
              (acc, currentSong) => acc + currentSong.playbacks,
              0
            ),
          };
          delete toReturn.songs;
          return toReturn;
        })
        .sort((a, b) => b.totalPlaybacks - a.totalPlaybacks);
      data.length = 3;
      res.send({
        data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving artists.",
      });
    });
};
