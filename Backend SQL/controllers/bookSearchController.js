const bookSearchCtrl = {};
// Get all books => fonctionne
bookSearchCtrl.getBooks = async (pool, req, res) => {
  try {
    const [dietBooks] = await pool.execute("SELECT * FROM DietBook");
    res.json(dietBooks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error getting dietbooks" });
  }
};

// Get a book by id
bookSearchCtrl.getBookById = async (pool, req, res) => {
  try {
    const { dietId } = req.params;

    const [dietBook] = await pool.execute("SELECT * FROM DietBook WHERE id=?", [
      dietId,
    ]);
    if (dietBook.length === 0) {
      return res.status(404).json({ message: "Dietbook not found" });
    }

    res.json(dietBook[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error getting dietbook" });
  }
};

module.exports = bookSearchCtrl;
