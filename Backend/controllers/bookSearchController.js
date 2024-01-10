const DietBook = require("../models/book");

// Get all books => fonctionne
const getBooks = async (req, res) => {
  try {
    const dietBooks = await DietBook.find();
    res.json(dietBooks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error books" });
  }
};

// Get a book by id
const getBookById = async (req, res) => {
  try {
    const { dietId } = req.params;

    const book = await DietBook.findOne({ id: dietId });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getBooks,
  getBookById,
};
