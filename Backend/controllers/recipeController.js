const Recipe = require("../models/recipe");
require("mongoose");
const jwt = require("jsonwebtoken");

async function updateRecipe(req, res) {
  try {
    const { recipeId } = req.params;

    const { title, livret, ingredient, recipe, customerId } = req.body;
    console.log(livret);
    const recipeToUpdate = await Recipe.findOne({ id: recipeId });

    // vérification si l'ID du livret est déjà présent
    let dietBookExist = recipeToUpdate.livret.includes(livret);
    console.log(dietBookExist);
    if (livret === undefined) {
      dietBookExist = !dietBookExist;
    }

    const updateRecipe = {
      title: title || recipeToUpdate.title,
      livret: dietBookExist
        ? recipeToUpdate.livret
        : [...recipeToUpdate.livret, livret],
      ingredient: ingredient || recipeToUpdate.ingredient,
      recipe: recipe || recipeToUpdate.recipe,
      customerId: customerId || recipeToUpdate.customerId,
    };

    Recipe.updateOne(
      { id: recipeId },
      { ...updateRecipe, id: recipeId }
    ).then(() => res.status(201).json({ message: "Recipe update !" }));
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "update recipe error" });
  }
}

module.exports = {
  updateRecipe,
};
