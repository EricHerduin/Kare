const mysql = require("mysql2/promise");

const updateBookCtrl = {};

// Update a book by id
updateBookCtrl.updateBook = async (pool, req, res) => {
  try {
    const { dietId } = req.params;

    const {
      title,
      pathology,
      nbStage,
      nbWeekPerStage,
      description,
      meal,
      sexe,
      customerId,
      online,
    } = req.body;

    // Recherche du dietBook à mettre à jour
    const [results] = await pool.execute(
      "SELECT * FROM DietBook WHERE id = ?",
      [dietId]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: "DietBook not found" });
    }

    const dietBook = results[0];

    // Mise à jour du dietBook
    const updatedDietBook = {
      title: title || dietBook.title,
      pathology: pathology || dietBook.pathology,

      nbStage: nbStage || dietBook.nbStage,
      nbWeekPerStage: nbWeekPerStage || dietBook.nbWeekPerStage,
      description: description || dietBook.description,
      meal: meal
        ? [
            ...new Set([
              ...(dietBook.meal ? dietBook.meal.split(",") : []),
              meal,
            ]),
          ]
        : dietBook.meal, // Ajout du repas s'il n'est pas déjà présent dans le tableau
      sexe: sexe || dietBook.sexe,
      customerId: customerId || dietBook.customerId,
      online: online === false ? 0 : 1 || dietBook.online,
    };
    console.log(updatedDietBook);

    await pool.execute(
      "UPDATE DietBook SET title=?, pathology=?, nbStage=?, nbWeekPerStage=?, description=?, meal=?, sexe=?, customerId=?, online=? WHERE id = ?",
      [
        updatedDietBook.title,
        updatedDietBook.pathology,
        updatedDietBook.nbStage,
        updatedDietBook.nbWeekPerStage,
        updatedDietBook.description,
        updatedDietBook.meal ? JSON.stringify(updatedDietBook.meal) : null,
        updatedDietBook.sexe,
        updatedDietBook.customerId,
        updatedDietBook.online,
        dietId,
      ]
    );

    res.status(200).json({ message: "DietBook mis à jour avec succès" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la mise à jour du DietBook" });
  }
};

module.exports = updateBookCtrl;

// const DietBook = require("../models/book");
// require("mongoose");
// const jwt = require("jsonwebtoken");

// // Update a book by id
// const updateBook = async (req, res) => {
//   try {
//     const { dietId } = req.params;

//     const {
//       title,
//       pathology,
//       nbStage,
//       nbWeekPerStage,
//       description,
//       meal,
//       sexe,
//       customerId,
//     } = req.body;

//     // Recherche du dietBook à mettre à jour
//     const dietBook = await DietBook.findOne({ id: dietId });

//     // Vérification si l'ID de repas existe déjà dans le tableau
//     let mealExists = dietBook.meal.includes(meal);

//     // vérification du undefined de meal
//     if (meal === undefined) {
//       console.log(mealExists);
//       mealExists = !mealExists;
//       console.log("changement de mealExists en true");
//     }
//     console.log(mealExists);
//     // Mise à jour du dietBook
//     const updatedDietBook = {
//       title: title || dietBook.title,
//       pathology: pathology || dietBook.pathology,
//       nbStage: nbStage || dietBook.nbStage,
//       nbWeekPerStage: nbWeekPerStage || dietBook.nbWeekPerStage,
//       description: description || dietBook.description,
//       meal: mealExists ? dietBook.meal : [...dietBook.meal, meal], // Ajout du nombre de repas s'il n'est pas déjà présent dans le tableau
//       sexe: sexe || dietBook.sexe,
//       customerId: customerId || dietBook.customerId,
//     };
//     console.log(updatedDietBook);

//     DietBook.updateOne(
//       { id: dietId },
//       { ...updatedDietBook, id: dietId }
//     ).then(() => res.status(201).json({ message: "book mis à jour" }));
//   } catch (error) {
//     res.status(401).json({ error });
//   }
// };

// module.exports = {
//   updateBook,
// };

// meal: meal
//         ? [
//             ...new Set([
//               ...(dietBook.meal ? dietBook.meal.split(",") : []),
//               meal,
//             ]),
//           ]
//         : dietBook.meal, // Ajout du repas s'il n'est pas déjà présent dans le tableau
