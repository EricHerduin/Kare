// Add a new book  -> fonctionne
const AddDeleteDietbook = {};

AddDeleteDietbook.addDietBook = async (pool, req, res) => {
  try {
    const {
      title,
      pathology,
      nbStage,
      nbWeekPerStage,
      description,
      meal,
      sexe,
      online,
    } = req.body;
    console.log(req.body);
    if (!title || !pathology) {
      return res
        .status(400)
        .json({ message: "Please provide name, pathology" });
    }
    const sanitizedValues = [
      title,
      pathology,
      nbStage || null,
      nbWeekPerStage || null,
      description || null,
      meal || null,
      sexe || null,
      online || "0",
    ];

    const [result] = await pool.execute(
      "INSERT INTO DietBook (title, pathology, nbStage, nbWeekPerStage, description, meal, sexe, online ) VALUES (?,?,?,?,?,?,?,?)",
      sanitizedValues
    );
    const dietbookId = result.insertId;

    res
      .status(201)
      .json({ message: "DietBook created successfully", dietbookId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "DietBook not created" });
  }
};
AddDeleteDietbook.deleteDietBook = async (pool, req, res) => {
  try {
    const { dietId } = req.params;

    const [resultRecipe] = await pool.execute(
      `SELECT * FROM Recipe WHERE JSON_CONTAINS(dietBookId, '[${dietId}]') = 1;`
    );
    console.log(resultRecipe);
    if (resultRecipe.length > 0) {
      // Retirer l'ID du dietBook supprimé dans recipe
      for (let i = 0; i < resultRecipe.length; i++) {
        const updatedDietBookArray = resultRecipe[i].dietBookId.filter(
          (id) => id.toString() !== dietId.toString()
        );
        pool.execute("UPDATE recipe SET dietBookId = ? WHERE id = ?", [
          updatedDietBookArray,
          resultRecipe[i].id,
        ]);
      }
    }

    const [result] = await pool.execute("DELETE FROM DietBook WHERE id = ?", [
      dietId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Dietbook not found" });
    }

    res.status(200).json({ message: "Dietbook deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { AddDeleteDietbook };

// Delete a book by id => fonctionne
// const deleteBook = async (req, res) => {
//   try {
//     const { dietId } = req.params;

//     const book = await DietBook.findOne({ id: dietId });
//     if (!book) {
//       return res.status(404).json({ message: "Book not found" });
//     }

//     book
//       .deleteOne({ id: dietId })
//       .then(() =>
//         res.status(200).json({ message: "Book deleted successfully" })
//       );
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// const { title, pathology, nbStage, nbWeekPerStage, description, meal, sexe } =
//     req.body;

//   let count = await DietBook.countDocuments();
//   if (!count) {
//     count = 0;
//   }
//   let id = count;
//   let idExist = DietBook.findOne({ id });
//   while (idExist) {
//     id++;
//     idExist = await DietBook.findOne({ id });
//   }
//   if (!title || !pathology) {
//     return res.status(400).json({ message: "Please provide name, pathology" });
//   }

//   const newdietbook = new DietBook({
//     id,
//     title,
//     pathology,
//     nbStage,
//     nbWeekPerStage,
//     description,
//     meal,
//     sexe,
//   });

//   newdietbook
//     .save()
//     .then(() => {
//       res.status(201).json("le dietbook est créé");
//     })
//     .catch((error) => {
//       res.status(500).json("erreur serveur");
//     });
