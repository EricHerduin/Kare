const Recipe = require("../models/recipe");
require("mongoose");
const jwt = require("jsonwebtoken");

async function updateRecipe(req, res) {
  try {
    const { recipeId } = req.params;

    const {
      title,
      dietbookIds,
      ingredients,
      recipe,
      customerId,
      pics,
      preprationTime,
      coockingTime,
      breackTime,
    } = req.body;

    const recipeToUpdate = await Recipe.findOne({ id: recipeId });

    // vérification si l'ID du livret est déjà présent
    let dietBookExist = recipeToUpdate.dietbookIds.includes(dietbookIds);
    console.log(dietBookExist);
    if (dietbookIds === undefined) {
      dietBookExist = !dietBookExist;
    }

    const updateRecipe = {
      title: title || recipeToUpdate.title,
      dietbookIds: dietBookExist
        ? recipeToUpdate.dietbookIds
        : [...recipeToUpdate.dietbookIds, dietbookIds],
      ingredients: ingredients || recipeToUpdate.ingredients,
      recipe: recipe || recipeToUpdate.recipe,
      customerId: customerId || recipeToUpdate.customerId,
      pics: pics || recipeToUpdate.pics,
      preprationTime: preprationTime || recipeToUpdate.preprationTime,
      coockingTime: coockingTime || recipeToUpdate.coockingTime,
      breackTime: breackTime || recipeToUpdate.breackTime,
    };

    Recipe.updateOne({ id: recipeId }, { ...updateRecipe, id: recipeId }).then(
      () => res.status(201).json({ message: "Recipe update !" })
    );
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "update recipe error" });
  }
}

module.exports = {
  updateRecipe,
};
