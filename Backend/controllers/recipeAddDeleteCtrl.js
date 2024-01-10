const Recipe = require("../models/recipe");
const jwt = require("jsonwebtoken");

async function addRecipe(req, res) {
  try {
    const { title, livret, ingredient, recipe, customerId } = req.body;

    let count = await Recipe.countDocuments();
    if (!count) {
      count = 0;
    }

    let id = count;

    let idExist = Recipe.findOne({ id });

    while (idExist) {
      id++;
      idExist = await Recipe.findOne({ id });
    }
    const newRecipe = new Recipe({
      id,
      title,
      livret,
      ingredient,
      recipe,
      customerId,
    });
    console.log(newRecipe);
    newRecipe.save();
    res.status(201).json({ message: "Recipe created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
}

async function deleteRecipe(req, res) {
  try {
    const { recipeId } = req.params;
    const recipe = await Recipe.findOne({ id: recipeId });
    if (!recipe) {
      return res.status(404).json({ message: "recipe not found" });
    }
    recipe
      .deleteOne({ id: recipeId })
      .then(() =>
        res.status(200).json({ message: "Recipe delete successfully" })
      );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
}
module.exports = {
  addRecipe,
  deleteRecipe,
};
