const DietMeal = require("../models/meal");

require("mongoose");
const jwt = require("jsonwebtoken");

// Update a meal by id
const updateMeal = async (req, res) => {
  try {
    const mealId = req.params.mealId;
    const dietId = req.params.dietId;

    const {
      typeMeal,
      collation,
      stage,
      meat,
      meatQuantity,
      meatList,
      sauce,
      sideDish,
      sideDishQuantity,
      sideDishList,
      drink,
      obs,
    } = req.body;
    // console.log(mealId);
    // console.log(dietId);
    // Recherche du dietBook à mettre à jour
    const dietMeal = await DietMeal.findOne({ id: mealId });

    // Mise à jour du dietBook

    const updatedDietMeal = {
      typeMeal: typeMeal || dietMeal.typeMeal,
      collation: collation || dietMeal.collation,
      stage: stage || dietMeal.stage,
      meat: meat || dietMeal.meat,
      meatQuantity: meatQuantity || dietMeal.meatQuantity,
      meatList: meatList || dietMeal.meatList,
      sauce: sauce || dietMeal.sauce,
      sideDish: sideDish || dietMeal.sideDish,
      sideDishQuantity: sideDishQuantity || dietMeal.sideDishQuantity,
      sideDishList: sideDishList || dietMeal.sideDishList,
      drink: drink || dietMeal.drink,
      obs: obs || dietMeal.obs,
      dietBookId: dietId,
    };

    //fonctionne jusqu'ici
    DietMeal.updateOne(
      { id: mealId },
      { ...updatedDietMeal, id: mealId }
    ).then(() => res.status(201).json({ message: "meal mis à jour" }));
  } catch (error) {
    res.status(404).json({ message: error });
  }
  // dietBook.updateOne({ id: dietId });
};

module.exports = {
  updateMeal,
};
