const prisma = require("../../prisma");

exports.findAll = (req, res) => {
  const { title, page = "1", size = "10" } = req.query;

  let condition = { skip: (page - 1) * size, take: size * 1 };

  if (title) {
    condition = {
      ...condition,
      where: { title: { contains: title, mode: "insensitive" } },
    };
  }

  prisma.song
    .findMany(condition)
    .then((data) => {
      res.send({ meta: condition, data });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving songs.",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  prisma.song
    .findUnique({
      where: { id: Number(id) },
    })
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Song with id " + id });
      else res.send({ data });
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving Song with id=" + id });
    });
};

exports.getTopTen = (req, res) => {
  prisma.song
    .findMany({
      orderBy: [
        {
          playbacks: "desc",
        },
      ],
      take: 10,
    })
    .then((data) => {
      res.send({ data });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving songs.",
      });
    });
};
