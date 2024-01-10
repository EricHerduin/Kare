const DietBook = require("../models/book");
require("mongoose");
const jwt = require("jsonwebtoken");

// Update a book by id
const updateBook = async (req, res) => {
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
    } = req.body;

    // Recherche du dietBook à mettre à jour
    const dietBook = await DietBook.findOne({ id: dietId });

    // Vérification si l'ID de repas existe déjà dans le tableau
    let mealExists = dietBook.meal.includes(meal);

    // vérification du undefined de meal
    if (meal === undefined) {
      console.log(mealExists);
      mealExists = !mealExists;
      console.log("changement de mealExists en true");
    }
    console.log(mealExists);
    // Mise à jour du dietBook
    const updatedDietBook = {
      title: title || dietBook.title,
      pathology: pathology || dietBook.pathology,
      nbStage: nbStage || dietBook.nbStage,
      nbWeekPerStage: nbWeekPerStage || dietBook.nbWeekPerStage,
      description: description || dietBook.description,
      meal: mealExists ? dietBook.meal : [...dietBook.meal, meal], // Ajout du nombre de repas s'il n'est pas déjà présent dans le tableau
      sexe: sexe || dietBook.sexe,
      customerId: customerId || dietBook.customerId,
    };
    console.log(updatedDietBook);

    DietBook.updateOne(
      { id: dietId },
      { ...updatedDietBook, id: dietId }
    ).then(() => res.status(201).json({ message: "book mis à jour" }));
  } catch (error) {
    res.status(401).json({ error });
  }
};

module.exports = {
  updateBook,
};
