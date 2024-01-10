const recipeCtrl = {};

recipeCtrl.addRecipe = async (pool, req, res) => {
  try {
    const {
      title,
      ingredients,
      recipe,
      customerId,
      preparationTime,
      cookingTime,
      breakTime,
      dietBookIds, // Utiliser un tableau pour stocker les dietBookIds
      pics,
    } = req.body || {};

    if (!dietBookIds || dietBookIds.length === 0) {
      return res.status(401).json({
        message: "dietBookIds missing, recipe not created",
      });
    }

    // Insérer la recette dans la table Recipe
    const [recipeResult] = await pool.execute(
      "INSERT INTO Recipe (title, ingredients, recipe, customerId, preparationTime, cookingTime, breakTime, pics, dietBookIds) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        title || null,
        ingredients || null,
        recipe || null,
        customerId || null,
        preparationTime || null,
        cookingTime || null,
        breakTime || null,
        pics || null,
        dietBookIds || null,
      ]
    );

    const recipeId = recipeResult.insertId;

    // Mettre à jour les dietBooks avec l'ID de la recette
    await updateDietBooks(pool, dietBookIds, recipeId);

    res.status(201).json({ message: "Recipe created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
async function updateDietBooks(pool, dietBookIds, recipeId) {
  for (const dietBookId of dietBookIds) {
    const [dietBook] = await pool.execute(
      "SELECT * FROM DietBook WHERE id = ?",
      [dietBookId]
    );

    if (dietBook.length > 0) {
      const recipes = dietBook[0].recipes || []; // Récupérer les recettes existantes

      recipes.push(recipeId); // Ajouter la nouvelle recette

      // Mettre à jour la variable recipes dans la table DietBook
      await pool.execute("UPDATE DietBook SET recipes = ? WHERE id = ?", [
        JSON.stringify(recipes),
        dietBookId,
      ]);
    }
  }
}

recipeCtrl.deleteRecipe = async (pool, req, res) => {
  try {
    const { recipeId } = req.params;

    const [recipe] = await pool.execute("SELECT * FROM Recipe where id =?", [
      recipeId,
    ]);
    if (recipe.length === 0) {
      return res.status(404).json({ message: "recipe not found" });
    }
    const [bookResult] = recipe[0].dietBookId;
    bookResult.forEach((element) => {
      const [bookResultAfterDelete] = pool.execute(
        "SELECT * FROM DietBook WHERE id = ?",
        [element]
      );
      console.log(bookResultAfterDelete);
    });

    // Supprimer le meal de la table DietMeal
    const [result] = await pool.execute("DELETE FROM recipe WHERE id = ?", [
      recipeId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(200).json({ message: "Recipe delete successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
};
module.exports = recipeCtrl;
