const getRecipeCtrl = {};

// Récupération de la recette par son Id
getRecipeCtrl.getRecipeById = async (pool, req, res) => {
  try {
    const { recipeId } = req.params;
    const [recipe] = await pool.execute("SELECT * FROM Recipe WHERE id=?", [
      recipeId,
    ]);
    if (recipe.length === 0) {
      return res.status(404).json({ message: "recipe not found" });
    }

    res.json(recipe[0]);
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};

// Récupération de toutes les recettes
getRecipeCtrl.getAllRecipe = async (pool, req, res) => {
  try {
    const [recipes] = await pool.execute("SELECT * FROM Recipe");
    res.json(recipes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error recipes" });
  }
};

module.exports = getRecipeCtrl;
