const Recipe = require("../models/recipe");
const jwt = require("jsonwebtoken");

// Récupération de la recette par son Id
const getRecipeById = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const recipe = await Recipe.findOne({ id: recipeId });
    if (!recipe) {
      return res.status(404).json({ message: "recipe not found" });
    }

    res.json(recipe);
  } catch (error) {
    restart.status(500).json({ message: "server error" });
  }
};

// Récupération de toutes les recettes
const getAllRecipe = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error recipes" });
  }
};

module.exports = {
  getAllRecipe,
  getRecipeById,
};
