const DietBook = require("../models/book");

// Add a new book  -> fonctionne
async function addDietBook(req, res) {
  const {
    title,
    pathology,
    nbStage,
    nbWeekPerStage,
    description,
    meal,
    sexe,
  } = req.body;

  let count = await DietBook.countDocuments();
  if (!count) {
    count = 0;
  }
  let id = count;
  let idExist = DietBook.findOne({ id });
  while (idExist) {
    id++;
    idExist = await DietBook.findOne({ id });
  }
  if (!title || !pathology) {
    return res.status(400).json({ message: "Please provide name, pathology" });
  }

  const newdietbook = new DietBook({
    id,
    title,
    pathology,
    nbStage,
    nbWeekPerStage,
    description,
    meal,
    sexe,
  });

  newdietbook
    .save()
    .then(() => {
      res.status(201).json("le dietbook est créé");
    })
    .catch((error) => {
      res.status(500).json("erreur serveur");
    });
}

// Delete a book by id => fonctionne
const deleteBook = async (req, res) => {
  try {
    const { dietId } = req.params;

    const book = await DietBook.findOne({ id: dietId });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    book
      .deleteOne({ id: dietId })
      .then(() =>
        res.status(200).json({ message: "Book deleted successfully" })
      );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addDietBook,
  deleteBook,
};
